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
import SnackBar from "../widget/SnackBar";
import { useSession } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const queryClient = useQueryClient()
  queryClient.prefetchQuery({queryKey:["shop"]})
  const { data, isLoading, isSuccess, isError, error } = useShop();
  console.log(data?.data);
  
  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    const status = (error as any)?.status;
    if (status === 401) {
      return <p>Unauthorized. Please log in again.</p>;
    }
    return <p>Error: {(error as Error).message}</p>;
  }

  if (data?.data?.length > 0) {
    const shopslug = createSlug(data?.data[0].name, data?.data[0].id);
    redirect(`/${shopslug}/employees`);
  }else{
    redirect(`/no-shop`);
  }

  return (
    <main className="min-h-screen w-full bg-white font-medium">
      you have no shop
    </main>
  );
}
