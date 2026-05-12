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

const reservedRoutes = [
  "no-shop",
  "setup-branch",
  "sign-in",
  "accept-invitation",
];

const checkShop = async () => {
  const data: ApiResponse<UserShopStatusDTO> = await fetchwithauth({
    endpoint: "/user/me/shop-status",
    method: "GET",
  });
  return data.data;
};

const checkContext = async (shopSlug: string) => {
  const data: ApiResponse<ShopContextDTO> = await fetchwithauth({
    endpoint: `/shops/context/${shopSlug}`,
    method: "GET",
  });
  return data.data;
};

export default clerkMiddleware(async (auth, req) => {
  const i18nResponse = handleI18nRouting(req);

  if (isPublicRoute(req)) {
    return i18nResponse;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const locale = segments[0];
    const shopSlug = segments[1];
    const subRoute = segments[2];

    if (shopSlug && reservedRoutes.includes(shopSlug) && !subRoute) {
      return i18nResponse;
    }

    if (locale !== "th") {
      const url = req.nextUrl.clone();
      url.pathname = `/th/${req.nextUrl.pathname}`;
      return NextResponse.redirect(url);
    }

    const shopStatus = await checkShop();

    // avoid redirect loop
    const isNoShopPage = req.nextUrl.pathname.includes("/no-shop");
    if (!shopStatus?.hasShop && !isNoShopPage) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/no-shop`;
      return NextResponse.redirect(url);
    }

    if (!shopSlug) {
      // /:locale
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/${shopStatus?.firstShopSlug}/employees`;
      return NextResponse.redirect(url);
    }

    if (!subRoute) {
      // /:locale/:slug
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/${shopSlug}/employees`;
      return NextResponse.redirect(url);
    }

    const context = await checkContext(shopSlug);

    if (context?.status !== SHOP_CONTEXT_STATUS.OK) {
      return NextResponse.redirect(
        new URL(context?.redirectTo || "/", req.url),
      );
    }
    return i18nResponse;
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
