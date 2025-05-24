import EmployeeStatus from "@/app/components/Employees/EmployeeStatus";
import { Employee } from "@/types/employee";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React, { useMemo, useState } from "react";
import { useAllSelectKit } from "../../../../../hooks/useSelectKit";

interface PayrollsAllEmployeesElementProps {
  id: string;
  name: string;
  email: string;
  nickname: string;
  amount: number;
  branch: string;
  status: number;
}

function getRandomPastelColor() {
  const r = Math.floor(Math.random() * 128) + 127; // Random red value (127-255)
  const g = Math.floor(Math.random() * 128) + 127; // Random green value (127-255)
  const b = Math.floor(Math.random() * 128) + 127; // Random blue value (127-255)

  return `rgb(${r}, ${g}, ${b})`;
}

export default function PayrollsAllEmployeesElement({
  id,
  name,
  email,
  nickname,
  amount,
  branch,
  status,
}: PayrollsAllEmployeesElementProps) {
  const moneyFormat = new Intl.NumberFormat("th-TH").format(amount || 0);
  const { add, remove, updateAtId } = useAllSelectKit();
  const updateCheckboxAtIndex = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked: boolean = e.currentTarget.checked;
    updateAtId(id);
    if (checked) {
      add([
        {
          id: id,
          name: name,
          nickname: nickname,
          email: email,
          amount: amount,
          status: status,
          branch: branch,
        },
      ]);
    } else {
      remove([id]);
    }
  };

  const isChecked = useAllSelectKit((state) => state.checkboxs[id] ?? false);
  return (
    <>
      <tr className="cursor-pointer">
        <td>
          <div className="flex gap-4  items-center">
            <Checkbox
              checked={isChecked}
              onChange={(e) => {
                updateCheckboxAtIndex(e);
              }}
            />
          </div>
        </td>
        <td>
          <div className="flex flex-col gap-[0.5px]">
            <p>{name}</p>
            <p className="text-xs opacity-65">{email}</p>
          </div>
        </td>
        <td>{nickname}</td>
        <td>{branch}</td>
        <td>
          <EmployeeStatus status={status} />
        </td>
      </tr>
    </>
  );
}
