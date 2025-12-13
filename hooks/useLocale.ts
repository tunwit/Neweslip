import { useParams } from "next/navigation";

export const useLocale = () => {
  const params = useParams();
  const locale = Array.isArray(params.locale)
    ? params.locale[0]
    : params.locale;
  if (!locale) return null;
  return locale;
};
