import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { fetchwithauth } from "./utils/fetcher";
import { ApiResponse } from "./types/response";
import {
  SHOP_CONTEXT_STATUS,
  ShopContextDTO,
  UserShopStatusDTO,
} from "./types/type.user";
import { redirect } from "./i18n/navigation";
import { getLocale } from "next-intl/server";

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  "/:locale/:shopSlug(.*)",
  "/:locale",
]);

const isPublicRoute = createRouteMatcher([
  "/:locale/accept-invitation",
  "/accept-invitation",
  "/:locale/sign-in",
  "/sign-in",
]);

export default clerkMiddleware(async (auth, req) => {
  const i18nResponse = handleI18nRouting(req);

  if (isPublicRoute(req)) {
    return i18nResponse;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return i18nResponse;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|.*\\..*).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
