"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { redirect } from "next/navigation";
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
