"use client";
import { Autocomplete, Option, Select } from "@mui/joy";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

interface OrderByFilterProps<E extends Record<string, string>> {
  choices: E;
  onChange: (newvalue: E[keyof E]) => void;
  disable?: boolean;
}

export default function OrderByFilter<E extends Record<string, string>>({
  choices,
  onChange,
  disable = false,
}: OrderByFilterProps<E>) {
  const t = useTranslations("employees.filters.order_by");
  const values = useMemo(
    () => Object.values(choices) as Array<E[keyof E]>,
    [choices],
  );

  const defaultValue = values[0];
  return (
    <>
      <Select
        disabled={disable}
        defaultValue={defaultValue}
        onChange={(_, newValue) => {
          if (newValue !== null) {
            onChange(newValue);
          }
        }}
        sx={{ fontSize: "14px" }}
      >
        {Object.entries(choices).map(([key, value]) => (
          <Option key={key} value={value}>
            {t(key.toLowerCase())}
          </Option>
        ))}
      </Select>
    </>
  );
}
