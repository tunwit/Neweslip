import { Autocomplete, Option, Select } from "@mui/joy";
import React, { useEffect } from "react";
import { useBranch } from "../hooks/useBranch";

interface Branch {
  id: number;
  name: string;
  shopId: number;
}

interface BranchSelectorProps {
  value: number;
  onChange: (newvalue: number) => void;
}

export default function BranchSelector({
  value,
  onChange,
}: BranchSelectorProps) {
  const { data, isPending } = useBranch();

  return (
    <>
      <Select value={value} onChange={(e, newvalue) => onChange(newvalue!)}>
        {data.map((v: Branch) => {
          return <Option value={v.id}>{v.name}</Option>;
        })}
      </Select>
    </>
  );
}
