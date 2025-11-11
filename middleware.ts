import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { extractSlug } from './utils/extractSlug';
import { NextResponse } from 'next/server';

// Define route matchers
const protectedRoutes = createRouteMatcher(['/', '/:shopSlug(.*)']);
const publicRoutes = createRouteMatcher(['/setup-branch','/no-shop', '/api', '/trpc']);

// Helper to fetch shop branches
async function fetchData(token: string, origin: string, path:string) {
  const res = await fetch(`${origin}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`API returned ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn, getToken } = await auth();
  const pathname = req.nextUrl.pathname;

  // Skip public routes early
  if (publicRoutes(req)) return NextResponse.next();

  // Require authentication for protected routes
  if (protectedRoutes(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Extract shop slug (if any)
  const shopSlug = pathname.split('/')[1];
  if (!shopSlug || shopSlug === 'api') return NextResponse.next();

  const { id:shopId } = extractSlug(shopSlug);

  // Redirect if slug extraction fails
  if (!shopId || shopId === -1) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const token = await getToken();
    if(token == null) redirectToSignIn();
    const shops = await fetchData(token, req.nextUrl.origin, `/api/shop?shopId=${userId}`);
     // Redirect to setup if no branches exist
    if (!shops || shops.length === 0) {
      return NextResponse.redirect(
        new URL(`/no-shop`, req.url)
      );
    }
    
    const branches = await fetchData(token, req.nextUrl.origin, `/api/shop/branch?shopId=${shopId}`);

    // Redirect to setup if no branches exist
    if (!branches || branches.length === 0) {
      return NextResponse.redirect(
        new URL(`/setup-branch?shopId=${shopId}&returnBack=${req.nextUrl.href}`, req.url)
      );
    }

    // All checks passed
    return NextResponse.next();
  } catch (err) {
    console.error('Error checking shop branches:', err);
    return NextResponse.redirect(new URL('/error?message=branch-check-failed', req.url));
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
