import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:locale/:shopSlug(.*)",
  "/:locale",
]);

const isPublicRoute = createRouteMatcher([
  "/:locale/accept-invitation",
  "/accept-invitation",
  "/api/shop/:shopId",
  "/api/invitations/:token",
]);

const isApiRoute = (req: NextRequest) => {
  return (
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/trpc")
  );
};

export default clerkMiddleware(async (auth, req) => {
  if (isApiRoute(req)) {
    if (!isPublicRoute(req)) {
      await auth.protect();
    }
    return NextResponse.next();
  }

  if (isPublicRoute(req)) {
    return handleI18nRouting(req);
  }
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  return handleI18nRouting(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|.*\\..*).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
