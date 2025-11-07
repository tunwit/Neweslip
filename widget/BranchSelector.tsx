"use client";
import { Autocomplete, Option, Select } from "@mui/joy";
import React, { useEffect } from "react";
import { useBranch } from "../app/components/Employees/hooks/useBranch";
import { Branch } from "@/types/branch";

interface BranchSelectorProps {
  branchId: number;
  onChange: (newvalue: number) => void;
  disable?: boolean
  isEnableAll?: boolean
}

export default function BranchSelector({
  branchId,
  onChange,
  disable = false,
  isEnableAll = false
}: BranchSelectorProps) {
  const { data,isLoading } = useBranch();

  return (
    <>
      <Select disabled={disable} defaultValue={-1} value={branchId} onChange={(e, newvalue) => onChange(newvalue!)}>
        {isEnableAll && <Option value={-1}>All</Option>}
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
