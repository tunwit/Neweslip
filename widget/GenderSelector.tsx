"use client";
import { Option, Select } from "@mui/joy";
import React from "react";
import { GENDER } from "@/types/enum/enum";

interface GenderSelectorProps {
  gender: GENDER | null;
  onChange: (newvalue: GENDER) => void;
  disable?: boolean
  isEnableAll?: boolean
}

export default function GenderSelector({
  gender,
  onChange,
  disable = false,
  isEnableAll = false
}: GenderSelectorProps) {

  return (
    <>
      <Select disabled={disable} defaultValue={null} value={gender} onChange={(e, newvalue) => onChange(newvalue!)}>
        {isEnableAll && <Option value={null}>All</Option>}
        {Object.values(GENDER).map((v: GENDER) => {
          return (
            <Option key={v} value={v}>
              {v}
            </Option>
          );
        })}
      </Select>
    </>
  );
}
