"use client";
import Image from "next/image";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useShop } from "@/hooks/useShop";
import slugify from "slugify";
import { createSlug } from "@/utils/createSlug";
import { useQueryClient } from "@tanstack/react-query";
import { Modal, ModalDialog } from "@mui/joy";

export default function Home() {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery({ queryKey: ["shop"] });
  const { data, isLoading, isSuccess, isError, error } = useShop();
  useEffect(() => {
    if (data && data.data && data.data.length > 0) {
      const shopslug = createSlug(data.data[0].name, String(data.data[0].id));
      redirect(`/${shopslug}/employees`);
    } else {
      redirect(`/no-shop`);
    }
  }, [isSuccess, data]);

  if (isError) {
    const status = (error as any)?.status;
    if (status === 401) {
      return <p>Unauthorized. Please log in again.</p>;
    }
    return <p>Error: {(error as Error).message}</p>;
  }

  return (
    <main className="min-h-screen w-full bg-white font-medium">
      <Modal open={isLoading}>
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
