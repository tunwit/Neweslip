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
import { getShopContext } from "@/lib/server/context";

export default async function ShoppLayout({
  params,
  children,
}: {
  params: Promise<{ shopSlug: string; locale: string }>;
  children: React.ReactNode;
}) {
  const { shopSlug, locale } = await params;

  const context = await getShopContext(shopSlug);

  if (context?.status !== SHOP_CONTEXT_STATUS.NEED_BRANCH_SETUP) {
    redirect({ href: `/${shopSlug}/employees`, locale: locale });
  }
  return <div className="flex w-screen">{children}</div>;
}
