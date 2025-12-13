import en from "@/locales/UI/en.json";
import th from "@/locales/UI/th.json";

const UI_DICTIONARY = { en, th } as const;

type UIKey = keyof typeof en;

type Lang = keyof typeof UI_DICTIONARY;

export function getUIText(lang: Lang, key: UIKey): string {
  return UI_DICTIONARY[lang][key] ?? key;
}
