import { Icon } from "@iconify/react/dist/iconify.js";
import { Modal, ModalDialog } from "@mui/joy";
import { UserShopStatusDTO } from "@/types/type.user";
import { ApiResponse } from "@/types/response";
import { fetchwithauth } from "@/utils/fetcher";
import { redirect } from "@/i18n/navigation";

const checkShop = async () => {
  const data: ApiResponse<UserShopStatusDTO> = await fetchwithauth({
    endpoint: "/user/me/shop-status",
    method: "GET",
  });

  return data.data;
};

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const shopStatus = await checkShop();

  if (!shopStatus?.hasShop) {
    redirect({ href: `/no-shop`, locale: locale });
  }

  redirect({
    href: `/${shopStatus?.firstShopSlug}/employees`,
    locale: locale,
  });

  return <main className="min-h-screen w-full bg-white font-medium"></main>;
}
