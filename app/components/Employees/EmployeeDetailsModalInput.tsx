import React from "react";

interface EmployeeDetailsModalInputProps {
  disabled: boolean;
  value: string | number;
}
export default function EmployeeDetailsModalInput({
  disabled,
  value,
}: EmployeeDetailsModalInputProps) {
  return (
    <input
      disabled={disabled}
      defaultValue={value}
      className="rounded-sm  p-1 text-sm opacity-55 focus:outline-none enabled:bg-[#e2e2e2] disabled:p-0"
    />
  );
}
