import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import EmailForm from "./EmailForm";
import { useTranslations } from "next-intl";
import { useShopConfigs } from "@/hooks/hook.shop";

export default function EmailsTab() {
  const { data, isLoading } = useShopConfigs();
  const t = useTranslations("shops");
  if (isLoading || !data?.data) return;
  console.log(data);

  return (
    <>
      <div className="-mt-4">
        <h1 className="font-medium text-3xl">{t("tabs.email_config")}</h1>
        <EmailForm shopData={data?.data} />
      </div>
    </>
  );
}
