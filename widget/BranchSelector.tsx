"use client";
import { Autocomplete, Option, Select } from "@mui/joy";
import React, { useEffect } from "react";
import { useBranch } from "../hooks/useBranch";
import { Branch } from "@/types/branch";
import { useTranslations } from "next-intl";

interface BranchSelectorProps {
  branchId: number;
  onChange: (newvalue: number) => void;
  disable?: boolean;
  isEnableAll?: boolean;
}

export default function BranchSelector({
  branchId,
  onChange,
  disable = false,
  isEnableAll = false,
}: BranchSelectorProps) {
  const { data, isLoading } = useBranch();
  const t = useTranslations("employees.filters");

  return (
    <>
      <Select
        disabled={disable}
        defaultValue={-1}
        value={branchId}
        onChange={(e, newvalue) => onChange(newvalue!)}
        sx={{ fontSize: "14px" }}
      >
        {isEnableAll && <Option value={-1}>{t("branch.all")}</Option>}
        {data?.data?.map((v: Branch) => {
          return (
            <Option key={v.id} value={v.id}>
              {v.name}
            </Option>
          );
        })}
      </Select>
    </>
  );
}
