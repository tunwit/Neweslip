import { Employee } from "@/types/employee";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox, Modal, ModalClose, ModalDialog, Typography } from "@mui/joy";
import React, { useEffect, useMemo, useRef, useState } from "react";
import PayrollEditEmployeeModal from "./EditModal/PayrollEditEmployeeModal";
import { usePayrollSelectKit } from "../../../../hooks/useCheckBox";
import { getRandomPastelColor } from "@/utils/generatePastelColor";

interface PayrollsEmployeesElementProps {
  id: string;
  name: string;
  email: string;
  nickname: string;
  amount: number;
  branch: string;
  status: number;
}

export default function PayrollsEmployeesElement({
  id,
  name,
  email,
  nickname,
  amount,
  branch,
  status,
}: PayrollsEmployeesElementProps) {
  const moneyFormat = new Intl.NumberFormat("th-TH").format(amount || 0);
  const { checkboxs, updateAtId, add, remove } = usePayrollSelectKit();
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
  const randomColor = useRef(getRandomPastelColor()).current;
  const isChecked = usePayrollSelectKit(
    (state) => state.checkboxs[id] ?? false,
  );

  return (
    <>
      <tr className="cursor-pointer">
        <PayrollEditEmployeeModal
          name={name}
          amount={amount}
          open={open}
          setOpen={setOpen}
        />
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
        <td onClick={() => setOpen(true)}>{branch}</td>
        <td onClick={() => setOpen(true)}>{moneyFormat}</td>
        <td onClick={() => setOpen(true)}>
          <button className="text-blue-700 underline font-medium">Edit</button>
        </td>
      </tr>
    </>
  );
}
