"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React, { useMemo, useState } from "react";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import EmployeeStatusBadge from "./EmployeeStatusBadge";
import { EmployeeWithShop } from "@/types/employee";
import { moneyFormat } from "@/utils/formmatter";
import { useCheckBox } from "@/hooks/useCheckBox";
import { useLocale } from "next-intl";
import { getLocalizedName } from "@/lib/getLocalizedName";
import ChangableAvatar from "@/widget/ChangableAvatar";
import { useQueryClient } from "@tanstack/react-query";

function getRandomPastelColor() {
  const r = Math.floor(Math.random() * 128) + 127; // Random red value (127-255)
  const g = Math.floor(Math.random() * 128) + 127; // Random green value (127-255)
  const b = Math.floor(Math.random() * 128) + 127; // Random blue value (127-255)

  return `rgb(${r}, ${g}, ${b})`;
}

export default function EmployeesElement({
  employee,
}: {
  employee: EmployeeWithShop;
}) {
  const { toggle, isChecked } = useCheckBox<number>("allEmployeeTable");

  const [open, setOpen] = useState<boolean>(false);
  const locale = useLocale();
  const randomColor = useMemo(() => getRandomPastelColor(), []);

  const url = `${process.env.NEXT_PUBLIC_CDN_URL}/${employee.avatar}`;
  const queryClient = useQueryClient();

  return (
    <>
      <EmployeeDetailsModal employee={employee} open={open} setOpen={setOpen} />
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
        <td onClick={() => setOpen(true)} className="border-b">
          <div className="flex flex-row gap-3">
            <ChangableAvatar
              src={url}
              fallbackTitle={employee.firstName.charAt(0)}
              editable={false}
            />
            <div className="flex flex-col gap-[0.5px]">
              <p>{employee.firstName + " " + employee.lastName}</p>
              <p className="text-xs opacity-65">{employee.email}</p>
            </div>
          </div>
        </td>
        <td onClick={() => setOpen(true)} className="border-b">
          {employee.nickName}
        </td>
        <td onClick={() => setOpen(true)} className="border-b">
          {moneyFormat(employee.salary)} ฿
        </td>
        <td onClick={() => setOpen(true)} className="border-b">
          {getLocalizedName(employee.branch, locale)}
        </td>
        <td onClick={() => setOpen(true)} className="border-b">
          <EmployeeStatusBadge status={employee.status} />
        </td>
      </tr>
    </>
  );
}
