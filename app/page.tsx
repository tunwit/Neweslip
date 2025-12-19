"use client";
import Image from "next/image";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import EmployeesTable from "./components/Employees/EmployeesTable";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useShop } from "@/hooks/shop/useShop";
import slugify from "slugify";
import { createSlug } from "@/utils/createSlug";
import SnackBar from "../widget/SnackBar";
import { useQueryClient } from "@tanstack/react-query";
import { Modal, ModalDialog } from "@mui/joy";

export default function Home() {
  redirect(`/`);

  return (
    <main className="min-h-screen w-full bg-white font-medium">
      <Modal open={true}>
        <ModalDialog>
          <div className="flex flex-col items-center justify-center">
            <Icon
              icon={"mynaui:spinner"}
              className="animate-spin"
              fontSize={50}
            />

            <p> Loading Shop</p>
          </div>
        </ModalDialog>
      </Modal>
    </main>
  );
}
