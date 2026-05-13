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

export default async function ShoppLayout({
  params,
  children,
}: {
  params: Promise<{ shopSlug: string; locale: string }>;
  children: React.ReactNode;
}) {
  return <div className="flex w-screen">{children}</div>;
}
