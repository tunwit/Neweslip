import EmployeeStatus from "@/app/components/Employees/EmployeeStatus";
import { Employee } from "@/types/employee";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React, { useMemo, useState } from "react";

interface PayrollsAllEmployeesElementProps {
  id: number;
  name: string;
  email: string;
  nickname: string;
  amount: number;
  branch: string;
  status: number;
  checkboxs: boolean[];
  setCheckboxs: React.Dispatch<React.SetStateAction<boolean[]>>;
  setSelectedEm: React.Dispatch<React.SetStateAction<Employee[]>>;
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
  checkboxs,
  setCheckboxs,
  setSelectedEm,
}: PayrollsAllEmployeesElementProps) {
  const moneyFormat = new Intl.NumberFormat("th-TH").format(amount || 0);

  const updateCheckboxAtIndex = (e: React.ChangeEvent<HTMLInputElement>) => {
    const state: boolean = e.currentTarget.checked;
    setCheckboxs((prev) => prev.map((item, i) => (i === id ? state : item)));
    setSelectedEm((prev) => {
      if (state) {
        // Add item if checked
        return [
          ...prev,
          {
            id: id,
            name: name,
            nickname: nickname,
            email: email,
            amount: amount,
            status: status,
            branch: branch,
          },
        ];
      } else {
        // Remove item if unchecked
        return prev.filter((item) => item.id !== id);
      }
    });
  };

  const [open, setOpen] = useState<boolean>(false);

  const randomColor = useMemo(() => getRandomPastelColor(), []);
  return (
    <>
      <tr className="cursor-pointer">
        <td>
          <div className="flex gap-4  items-center">
            <Checkbox
              checked={checkboxs[id]}
              onChange={(e) => {
                updateCheckboxAtIndex(e);
              }}
            />
          </div>
        </td>
        <td onClick={() => setOpen(true)}>
          <div className="flex flex-col gap-[0.5px]">
            <p>{name}</p>
            <p className="text-xs opacity-65">{email}</p>
          </div>
        </td>
        <td onClick={() => setOpen(true)}>{nickname}</td>
        <td onClick={() => setOpen(true)}>{branch}</td>
        <td>
          <EmployeeStatus status={status} />
        </td>
      </tr>
    </>
  );
}
