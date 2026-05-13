import { redirect } from "@/i18n/navigation";
import React from "react";

export default async function SlugPage({
  params,
}: {
  params: Promise<{
    locale: string;
    shopSlug: string;
  }>;
}) {
  const { locale, shopSlug } = await params;
  redirect({ href: `${shopSlug}/employees`, locale: locale });
  return <div>nothing here</div>;
}
