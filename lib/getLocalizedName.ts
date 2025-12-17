export function getLocalizedName<T extends { name: string; nameEng: string }>(
  item: T,
  locale: string,
) {
  return locale === "en" ? item.nameEng : item.name;
}
