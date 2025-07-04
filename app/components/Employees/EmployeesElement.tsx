"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React, { useMemo, useState } from "react";
import EmployeeDetailsModal from "./EmployeeDetailsModal";
import EmployeeStatus from "./EmployeeStatus";
import { useEmployeeSelectKit } from "@/hooks/useSelectKit";

interface EmployeesElementProps {
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

export default function EmployeesElement({
  id,
  name,
  email,
  nickname,
  amount,
  branch,
  status,
}: EmployeesElementProps) {
  const { updateAtId, checkboxs, add, remove } = useEmployeeSelectKit();
  const moneyFormat = new Intl.NumberFormat("th-TH").format(amount || 0);

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

  const [open, setOpen] = useState<boolean>(false);

  const randomColor = useMemo(() => getRandomPastelColor(), []);

  const isChecked = useEmployeeSelectKit(
    (state) => state.checkboxs[id] ?? false,
  );
  return (
    <>
      <EmployeeDetailsModal
        name={name}
        email={email}
        nickname={nickname}
        amount={amount}
        branch={branch}
        status={status}
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
              {name.charAt(0)}
            </div>
          </div>
        </td>
        <td onClick={() => setOpen(true)}>
          <div className="flex flex-col gap-[0.5px]">
            <p>{name}</p>
            <p className="text-xs opacity-65">{email}</p>
          </div>
        </td>
        <td onClick={() => setOpen(true)}>{nickname}</td>
        <td onClick={() => setOpen(true)}>{moneyFormat} ฿</td>
        <td onClick={() => setOpen(true)}>{branch}</td>
        <td onClick={() => setOpen(true)}>
          <EmployeeStatus status={status} id={id} />
        </td>
      </tr>
    </>
  );
}
