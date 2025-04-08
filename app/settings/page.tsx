"use client";
import Image from "next/image";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import EmployeesTable from "@/app/components/Employees/EmployeesTable";
import PendingElement from "@/app/components/Payrolls/PendingElement";
import dayjs from "dayjs";
import { Checkbox } from "@mui/joy";
import PendingSection from "@/app/components/Payrolls/PendingSection";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function Page() {
  const rounter = useRouter();
  return (
    <main className="min-h-screen w-full bg-white font-medium">
      <div className="mx-10 flex flex-col min-h-screen ">
        <div className="flex flex-row text-[#424242] text-xs mt-10">
          <p>
            {" "}
            Haris {">"} Configure {">"}&nbsp;
          </p>
          <p className="text-blue-800">Settings</p>
        </div>
        <div className="mt-5 flex flex-row justify-between">
          <p className="text-black text-4xl font-bold">Settings</p>
        </div>
      </div>
    </main>
  );
}
