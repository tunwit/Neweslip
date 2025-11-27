import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  "/:shopSlug(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/no-shop",
  "/accept-invitation",
  "/api/shop/:shopId",
  "/api/invitations/:token"

]);

export default clerkMiddleware(async (auth, req) => {
  if(isPublicRoute(req)){
    return NextResponse.next()
  }
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|.*\\..*).*)",
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}