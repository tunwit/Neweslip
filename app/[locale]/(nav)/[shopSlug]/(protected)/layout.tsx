import { SHOP_CONTEXT_STATUS } from "@/types/type.user";
import { redirect } from "@/i18n/navigation";
import { getShopContext, getShopStatus } from "@/lib/server/context";

export default async function ShoppLayout({
  params,
  children,
}: {
  params: Promise<{ shopSlug: string; locale: string }>;
  children: React.ReactNode;
}) {
  const { locale, shopSlug } = await params;
  const shopStatus = await getShopStatus();
  if (!shopStatus?.hasShop) {
    redirect({ href: "/no-shop", locale: locale });
  }

  const context = await getShopContext(shopSlug);
  if (context?.status !== SHOP_CONTEXT_STATUS.OK) {
    redirect({ href: `${context?.redirectTo}`, locale: locale });
  }

  return <div className="flex w-screen">{children}</div>;
}
