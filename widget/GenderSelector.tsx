"use client";
import { Option, Select } from "@mui/joy";
import React from "react";
import { GENDER } from "@/types/enum/enum";
import { useTranslations } from "next-intl";

interface GenderSelectorProps {
  gender: GENDER | null;
  onChange: (newvalue: GENDER) => void;
  disable?: boolean;
  isEnableAll?: boolean;
}

export default function GenderSelector({
  gender,
  onChange,
  disable = false,
  isEnableAll = false,
}: GenderSelectorProps) {
  const t = useTranslations("employees.filters.gender");
  return (
    <>
      <Select
        disabled={disable}
        defaultValue={null}
        value={gender}
        onChange={(e, newvalue) => onChange(newvalue!)}
      >
        {isEnableAll && <Option value={null}>All</Option>}
        {Object.values(GENDER).map((v: GENDER) => {
          return (
            <Option key={v} value={v}>
              {t(v)}
            </Option>
          );
        })}
      </Select>
    </>
  );
}
