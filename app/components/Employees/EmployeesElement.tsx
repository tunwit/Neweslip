"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React, { useMemo, useState } from "react";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import { useEmployeeSelectKit } from "@/hooks/useSelectKit";
import EmployeeStatusBadge from "./EmployeeStatusBadge";
import { EmployeeWithShop } from "@/types/employee";

function getRandomPastelColor() {
  const r = Math.floor(Math.random() * 128) + 127; // Random red value (127-255)
  const g = Math.floor(Math.random() * 128) + 127; // Random green value (127-255)
  const b = Math.floor(Math.random() * 128) + 127; // Random blue value (127-255)

  return `rgb(${r}, ${g}, ${b})`;
}

export default function EmployeesElement({
  employee
}: {employee:EmployeeWithShop}) {
  const { updateAtId, checkboxs, add, remove } = useEmployeeSelectKit();
  const moneyFormat = new Intl.NumberFormat("th-TH").format(employee.salary || 0);

  const updateCheckboxAtIndex = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked: boolean = e.currentTarget.checked;
    updateAtId(employee.id);
    if (checked) {
      add([employee]);
    } else {
      remove([employee.id]);
    }
  };

  const [open, setOpen] = useState<boolean>(false);

  const randomColor = useMemo(() => getRandomPastelColor(), []);

  const isChecked = useEmployeeSelectKit(
    (state) => state.checkboxs[employee.id] ?? false,
  );
  return (
    <>
      <EmployeeDetailsModal
        employee={employee}
        open={open}
        setOpen={setOpen}
      />
      <tr className="cursor-pointer">
        <td>
          <div className="flex gap-4  items-center">
            <Checkbox
              checked={isChecked}
              onChange={(e) => {
                updateCheckboxAtIndex(e);
              }}
            />
            <div
              className="w-9 aspect-square min-w-8 text-center rounded-full flex items-center justify-center"
              style={{ backgroundColor: randomColor }}
              onClick={() => setOpen(true)}
            >
              {employee.firstName.charAt(0)}
            </div>
          </div>
        </td>
        <td onClick={() => setOpen(true)}>
          <div className="flex flex-col gap-[0.5px]">
            <p>{employee.firstName + " " + employee.lastName}</p>
            <p className="text-xs opacity-65">{employee.email}</p>
          </div>
        </td>
        <td onClick={() => setOpen(true)}>{employee.nickName}</td>
        <td onClick={() => setOpen(true)}>{moneyFormat} ฿</td>
        <td onClick={() => setOpen(true)}>{employee.branch.name}</td>
        <td onClick={() => setOpen(true)}>
          <EmployeeStatusBadge status={employee.status} />
        </td>
      </tr>
    </>
  );
}
