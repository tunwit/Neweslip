import { ListItemDecorator, Option, Select } from "@mui/joy";
import React, { useState } from "react";
import thai from "@/public/flagIcons/thai.svg";
import eng from "@/public/flagIcons/eng.svg";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

const AVAILABLE_LANG = {
  th: {
    code: "th",
    flag: thai,
    label: "TH",
  },
  en: {
    code: "en",
    flag: eng,
    label: "EN",
  },
} as const;

type LangKey = keyof typeof AVAILABLE_LANG;

interface LanguageSelectorProps {
  theme?: "white" | "dark";
}
export default function LanguageSelector({
  theme = "dark",
}: LanguageSelectorProps) {
  const locale = useLocale() as LangKey;
  const [value, setValue] = useState<LangKey>(locale ?? "th");

  const currentLang = AVAILABLE_LANG[value];
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <Select
      value={value}
      onChange={(_, newValue) => {
        if (newValue) setValue(newValue);
      }}
      sx={{
        backgroundColor: theme === "dark" ? "#1f1f1f" : "#f7f7f7",
        color: theme === "dark" ? "white" : "black",
        border: 0,
        ":hover": {
          backgroundColor: theme === "dark" ? "#2a2a2a" : "#f2f2f2",
        },
      }}
      startDecorator={
        <Image
          alt={currentLang.label}
          src={currentLang.flag}
          width={20}
          height={20}
          loading="eager"
        />
      }
    >
      {Object.entries(AVAILABLE_LANG).map(([key, lang]) => (
        <Option
          key={key}
          value={key}
          onClick={() => {
            const query = searchParams.toString();
            router.push(query ? `${pathname}?${query}` : pathname, {
              locale: lang.code,
            });
            router.refresh();
          }}
        >
          <ListItemDecorator>
            <Image alt={lang.label} src={lang.flag} width={20} height={20} />
          </ListItemDecorator>
          {lang.label}
        </Option>
      ))}
    </Select>
  );
}
