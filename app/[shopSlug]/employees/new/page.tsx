"use client";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CreateStepper from "@/app/components/Employees/new/CreateStepper";
import { useEffect, useState } from "react";
import PersonalForm from "@/app/components/Employees/new/PersonalForm";
import AddressForm from "@/app/components/Employees/new/AddressForm";
import ContractForm from "@/app/components/Employees/new/ContractForm";
import { Breadcrumbs, Link } from "@mui/joy";
import { KeyboardArrowRight } from "@mui/icons-material";
import FormSection from "@/app/components/Employees/new/FormSection";
import SnackBar from "@/widget/SnackBar";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <main className="min-h-screen w-full bg-white font-medium">
      <div className="mx-10">
        <div className="flex flex-row text-[#424242] text-xs mt-10">
          <p>
            Haris {">"} Dashboard {">"} Employees {">"}&nbsp;
          </p>
          <p className="text-blue-800">New Employee</p>
        </div>

        <div className=" mt-5 flex flex-row justify-between mb-8">
          <p className="text-black text-4xl font-bold">New Employee</p>
        </div>

        <CreateStepper current={currentPage} />
        <div className="mx-20">
          <FormSection
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </main>
  );
}
