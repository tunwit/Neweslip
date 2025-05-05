"use client";
import Image from "next/image";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import EmployeesTable from "./components/Employees/EmployeesTable";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const rounter = useRouter();

  useEffect(() => {
    rounter.push("/d/employees");
  }, []);

  return (
    <main className="min-h-screen w-full bg-white font-medium">
      nothing here
    </main>
  );
}
