import { Icon } from "@iconify/react/dist/iconify.js";
import { Dayjs } from "dayjs";
import React from "react";
import Checkbox from "@mui/joy/Checkbox";

interface PendingElementProps {
  id: number;
  title: string;
  people: number;
  amount: number;
  modifyAt: Dayjs;
  status: number;
  checkboxs: boolean[];
  setCheckboxs: React.Dispatch<React.SetStateAction<boolean[]>>;
}

interface PayrollStatusType {
  icon: string;
  text: string;
  bg: string;
  textColor: string;
}

const PayrollStatus: { [key: number]: PayrollStatusType } = {
  1: {
    icon: "mdi:check-bold",
    text: "Success",
    bg: "bg-green-200",
    textColor: "text-green-950",
  },
  2: {
    icon: "tabler:clock",
    text: "Pending",
    bg: "bg-amber-200",
    textColor: "text-amber-950",
  },
};

export default function PendingElement({
  id,
  title,
  people,
  modifyAt,
  amount,
  status,
  checkboxs,
  setCheckboxs,
}: PendingElementProps) {
  const statusInfo = PayrollStatus[status] || {};
  const moneyFormat = new Intl.NumberFormat("th-TH").format(amount || 0);

  const updateCheckboxAtIndex = (e: React.ChangeEvent<HTMLInputElement>) => {
    const state: boolean = e.currentTarget.checked;

    setCheckboxs((prev) => prev.map((item, i) => (i === id ? state : item)));
  };
  return (
    <>
      <div className="flex flex-row gap-5 items-center w-full bg-[#f4f6f8] min-h-16 rounded-sm border border-[#d4d4d4] pl-5 pr-10 opacity-80 shadow-sm">
        <Checkbox
          checked={checkboxs[id]}
          onChange={(e) => {
            updateCheckboxAtIndex(e);
          }}
        />
        <div className="flex flex-row w-full font-light justify-between items-center ">
          <div className="flex flex-col min-w-[200px] ">
            <p className="font-bold">{title}</p>
            <div className="flex flex-row items-center text-xs gap-1 opacity-55">
              <Icon icon="solar:user-bold" />
              <p>{people} people</p>
            </div>
          </div>

          <p className="min-w-[150px]">
            {modifyAt?.format("DD MMM YYYY, HH:mm")}
          </p>

          <p className="min-w-[100px]">{moneyFormat} ฿</p>

          <div
            className={`flex flex-row justify-center items-center gap-1 px-2 py-[1px] rounded-2xl w-fit ${statusInfo.bg}`}
          >
            <Icon className={statusInfo.textColor} icon={statusInfo.icon} />
            <p className={`text-sm font-semibold ${statusInfo.textColor}`}>
              {statusInfo.text}
            </p>
          </div>

          <button className="text-blue-700 underline">Edit</button>
        </div>
      </div>
    </>
  );
}
