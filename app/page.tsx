"use client";
import Image from "next/image";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import EmployeesTable from "./components/Employees/EmployeesTable";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useShop } from "@/hooks/useShop";
import slugify from "slugify";
import { createSlug } from "@/utils/createSlug";
import SnackBar from "./components/UI/SnackBar";

export default function Home() {
  const { data, isPending, isSuccess } = useShop();

  useEffect(() => {
    if (!isSuccess) return;
    console.log(data);

    const shopslug = createSlug(data[0].shop.name, data[0].shop.id);
    redirect(`/${shopslug}/employees`);
  }, [isPending]);

  return (
    <main className="min-h-screen w-full bg-white font-medium">
      nothing here
      <SnackBar />
    </main>
  );
}
