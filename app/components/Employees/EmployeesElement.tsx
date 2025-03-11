import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface EmployeesElementProps {
  name: string;
  email: string;
  nickname: string;
  branch: string;
  status: number;
}

interface EmployeeStatusType {
  icon: string;
  text: string;
  bg: string;
  textColor: string;
}

const EmployeeStatus: { [key: number]: EmployeeStatusType } = {
  1: {
    icon: "mdi:check-bold",
    text: "Active",
    bg: "bg-green-200",
    textColor: "text-green-950",
  },
  2: {
    icon: "maki:cross",
    text: "Inactive",
    bg: "bg-gray-200",
    textColor: "text-gray-950",
  },
  3: {
    icon: "tabler:clock",
    text: "Part Time",
    bg: "bg-amber-200",
    textColor: "text-amber-950",
  },
};

function getRandomPastelColor() {
  const r = Math.floor(Math.random() * 128) + 127; // Random red value (127-255)
  const g = Math.floor(Math.random() * 128) + 127; // Random green value (127-255)
  const b = Math.floor(Math.random() * 128) + 127; // Random blue value (127-255)

  return `rgb(${r}, ${g}, ${b})`;
}

export default function EmployeesElement({
  name,
  email,
  nickname,
  branch,
  status,
}: EmployeesElementProps) {
  const statusInfo = EmployeeStatus[status] || {};
  const randomColor = getRandomPastelColor();

  return (
    <>
      <tr className="bg-[#fdfeff] text-sm h-14 border-b border-b-[#d4d4d4] opacity-75 font-semibold hover:bg-[#f0f4f8]">
        <td className="text-center flex justify-center items-center h-12">
          <div
            className="bg-teal-400 w-9 h-9 text-center rounded-full flex items-center justify-center"
            style={{ backgroundColor: randomColor }}
          >
            {name.charAt(0)}
          </div>
        </td>
        <td>
          <div className="flex flex-col gap-[0.5px]">
            <p>{name}</p>
            <p className="text-xs opacity-65">{email}</p>
          </div>
        </td>
        <td>{nickname}</td>
        <td>1,3000 ฿</td>
        <td>{branch}</td>
        <div
          className={`flex flex-row justify-center items-center gap-1 px-2 py-[1px] rounded-2xl w-fit ${statusInfo.bg}`}
        >
          <Icon className={statusInfo.textColor} icon={statusInfo.icon} />
          <p className={`font-semibold ${statusInfo.textColor}`}>
            {statusInfo.text}
          </p>
        </div>
      </tr>
    </>
  );
}
