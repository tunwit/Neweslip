import { validateSlug } from "@/lib/validateSlug";
import { auth } from "@clerk/nextjs/server";
import DashboardSidebar from "@/app/components/DashboardSidebar/DashboardSidebar";
import Navbar from "@/app/components/Navbar/Navbar";
import GlobalJobSnackbars from "@/widget/GlobalJobSnackbars";
import { extractSlug } from "@/utils/extractSlug";
import { ApiResponse } from "@/types/response";
import {
  SHOP_CONTEXT_STATUS,
  ShopContextDTO,
  UserShopStatusDTO,
} from "@/types/type.user";
import { fetchwithauth } from "@/utils/fetcher";
import { redirect } from "@/i18n/navigation";

const reservedSubRoutes = ["setup-branch"];

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

export default async function ShoppLayout({
  params,
  children,
}: {
  params: Promise<{ shopSlug: string; locale: string }>;
  children: React.ReactNode;
}) {
  const { locale, shopSlug } = await params;
  const shopStatus = await checkShop();
  if (!shopStatus?.hasShop) {
    redirect({ href: "no-shop", locale: locale });
  }

  const context = await checkContext(shopSlug);

  if (context?.status !== SHOP_CONTEXT_STATUS.OK) {
    redirect({ href: `${context?.redirectTo}`, locale: locale });
  }

  return <div className="flex w-screen">{children}</div>;
}
