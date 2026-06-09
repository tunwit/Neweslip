import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { cookies } from "next/headers";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const store = await cookies();
  const locale = store.get("locale")?.value || routing.defaultLocale;
  return {
    locale,
    messages: (await import(`@/locales/UI/${locale}.json`)).default,
  };
});
