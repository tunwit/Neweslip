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
import { useEffect } from "react";
import { useShop } from "@/hooks/useShop";

export default function Home() {
  const rounter = useRouter();
  return (
    <main className="min-h-screen w-full bg-white font-medium">
      <div className="mx-10 flex flex-col min-h-screen ">
        <div className="flex flex-row text-[#424242] text-xs mt-10">
          <p>
            {" "}
            Haris {">"} Dashboard {">"}&nbsp;
          </p>
          <p className="text-blue-800">Payrolls</p>
        </div>
        <div className="mt-5 flex flex-row justify-between">
          <p className="text-black text-4xl font-bold">Payrolls</p>
          <Button
            onClick={() => rounter.push("payrolls/edit")}
            startDecorator={<Add sx={{ fontSize: "20px" }} />}
            sx={{ fontSize: "13px", "--Button-gap": "5px", padding: 1.2 }}
          >
            New Payroll
          </Button>
        </div>

        <div className="mt-8 flex flex-row gap-2">
          <div className="w-[60%]">
            <p className="text-black text-xs mb-1">Search Payrolls</p>
            <div className="flex flex-row items-center gap-1 bg-[#fbfcfe] py-[7px] px-2 rounded-sm border border-[#c8cfdb] shadow-xs">
              <Icon
                className="text-[#424242]"
                icon={"material-symbols:search-rounded"}
              />
              <input
                type="text"
                placeholder="Search"
                className="text-[#424242] font-light text-sm  w-full  focus:outline-none "
              />
            </div>
          </div>

          <div className="w-[20%]">
            <p className="text-black text-xs mb-1">Status</p>
            <Select
              defaultValue="All"
              sx={{ borderRadius: "4px", fontSize: "14px" }}
            >
              <Option value="All">All</Option>
              <Option value="Active">Active</Option>
              <Option value="Part time">Part time</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </div>

          <div className="w-[20%]">
            <p className="text-black text-xs mb-1">Brach</p>
            <Select
              defaultValue="All"
              sx={{ borderRadius: "4px", fontSize: "14px" }}
            >
              <Option value="All">All</Option>
              <Option value="Pakkret">Pakkret</Option>
              <Option value="Ramintra">Ramintra</Option>
              <Option value="Kallapapruk">Kallapapruk</Option>
            </Select>
          </div>
        </div>

        <p className="mt-2">Pending</p>
        <div className="max-h-96">
          <PendingSection />
        </div>
      </div>
    </main>
  );
}
