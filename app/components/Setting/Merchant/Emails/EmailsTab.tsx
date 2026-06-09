import { useTranslations } from "next-intl";
import { useShopConfigs } from "@/hooks/hook.shop";
import { Option, Select } from "@mui/joy";
import { useState } from "react";
import { SEND_EMAIL_METHOD } from "@/types/type.shop";
import SMTPEmailForm from "./SMTPEmailForm";
import ResendEmailForm from "./ResendEmailForm";

export default function EmailsTab() {
  const { data, isLoading } = useShopConfigs();
  const [provider, setProvider] = useState(data?.data?.send_email_method);
  const t = useTranslations("shops");
  if (isLoading || !data?.data) return;
  return (
    <>
      <div className="-mt-4">
        <h1 className="font-medium text-3xl">{t("tabs.email_config")}</h1>
        <p>Provider</p>
        <Select
          className="max-w-40"
          onChange={(e, value) => setProvider(value || SEND_EMAIL_METHOD.SMTP)}
          defaultValue={data.data.send_email_method}
        >
          <Option value="SMTP">SMTP</Option>
          <Option value="RESEND">Resend</Option>
        </Select>
        <div hidden={provider !== SEND_EMAIL_METHOD.RESEND}>
          <ResendEmailForm shopData={data?.data} />
        </div>
        <div hidden={provider !== SEND_EMAIL_METHOD.SMTP}>
          <SMTPEmailForm shopData={data?.data} />
        </div>
      </div>
    </>
  );
}
