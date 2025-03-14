import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React, { useMemo, useState } from "react";

interface PayrollsEmployeesElementProps {
  id: number;
  name: string;
  email: string;
  nickname: string;
  amount: number;
  branch: string;
  status: number;
  checkboxs: boolean[];
  setCheckboxs: React.Dispatch<React.SetStateAction<boolean[]>>;
}

function getRandomPastelColor() {
  const r = Math.floor(Math.random() * 128) + 127; // Random red value (127-255)
  const g = Math.floor(Math.random() * 128) + 127; // Random green value (127-255)
  const b = Math.floor(Math.random() * 128) + 127; // Random blue value (127-255)

  return `rgb(${r}, ${g}, ${b})`;
}

export default function PayrollsEmployeesElement({
  id,
  name,
  email,
  nickname,
  amount,
  branch,
  status,
  checkboxs,
  setCheckboxs,
}: PayrollsEmployeesElementProps) {
  const moneyFormat = new Intl.NumberFormat("th-TH").format(amount || 0);

  const updateCheckboxAtIndex = (e: React.ChangeEvent<HTMLInputElement>) => {
    const state: boolean = e.currentTarget.checked;
    setCheckboxs((prev) => prev.map((item, i) => (i === id ? state : item)));
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
        <td onClick={() => setOpen(true)}>{branch}</td>
        <td onClick={() => setOpen(true)}>{moneyFormat}</td>
        <td onClick={() => setOpen(true)}>
          <button className="text-blue-700 underline font-medium">Edit</button>
        </td>
      </tr>
    </>
  );
}
