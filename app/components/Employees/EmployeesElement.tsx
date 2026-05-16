"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import EmployeeStatusBadge from "./EmployeeStatusBadge";
import { EmployeeWithBranchDTO } from "@/types/type.employee";
import { moneyFormat } from "@/utils/formmatter";
import { useCheckBox } from "@/hooks/useCheckBox";
import { useLocale } from "next-intl";
import { getLocalizedName } from "@/lib/getLocalizedName";
import ChangableAvatar from "@/widget/ChangableAvatar";
import { useQueryClient } from "@tanstack/react-query";

export default function EmployeesElement({
  employee,
  setTargetEmployee,
  setOpenEmployeeModal,
}: {
  employee: EmployeeWithBranchDTO;
  setTargetEmployee: Dispatch<SetStateAction<number>>;
  setOpenEmployeeModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { toggle, isChecked } = useCheckBox<number>("allEmployeeTable");
  const locale = useLocale();
  const handleClick = () => {
    setTargetEmployee(employee.id);
    setOpenEmployeeModal(true);
  };
  return (
    <>
      <tr className="h-15 hover:bg-gray-50 transition-colors cursor-pointer">
        <td className="pl-6 border-b">
          <div className="flex gap-4 items-center">
            <Checkbox
              checked={isChecked(employee.id)}
              onChange={(e) => {
                toggle(employee.id);
              }}
            />
          </div>
        </td>
        <td onClick={handleClick} className="border-b">
          <div className="flex flex-row gap-3">
            <ChangableAvatar
              src={employee.avatarUrl || ""}
              fallbackTitle={employee.firstName.charAt(0)}
              editable={false}
            />
            <div className="flex flex-col gap-[0.5px]">
              <p>{employee.firstName + " " + employee.lastName}</p>
              <p className="text-xs opacity-65">{employee.email}</p>
            </div>
          </div>
        </td>
        <td onClick={handleClick} className="border-b">
          {employee.nickName}
        </td>
        <td onClick={handleClick} className="border-b">
          {moneyFormat(employee.salary)} ฿
        </td>
        <td onClick={handleClick} className="border-b">
          {getLocalizedName(employee.branch, locale)}
        </td>
        <td onClick={handleClick} className="border-b">
          <EmployeeStatusBadge status={employee.status} />
        </td>
      </tr>
    </>
  );
}
