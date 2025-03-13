"use client";
import Image from "next/image";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import EmployeesTable from "./components/Employees/EmployeesTable";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { useRouter } from "next/navigation";

export default function Home() {
  const rounter = useRouter();
  rounter.push("/haris/employees");
  return (
    <main className="min-h-screen w-full bg-white font-medium">
      nothing here
    </main>
  );
}
