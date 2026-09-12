import { redirect } from "@/i18n/navigation";
import { getShopStatus } from "@/lib/server/context";

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const shopStatus = await getShopStatus();
  if (!shopStatus?.hasShop) {
    redirect({ href: `/no-shop`, locale: locale });
  }

  redirect({
    href: `/${shopStatus?.firstShopSlug}/employees`,
    locale: locale,
  });

  return <main className="min-h-screen w-full bg-white font-medium"></main>;
}
