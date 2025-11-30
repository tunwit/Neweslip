"use Client";
import CheckIcon from "@/assets/icons/CheckIcon";
import { useSnackbar } from "@/hooks/useSnackBar";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Snackbar } from "@mui/joy";
import React from "react";

interface SnackBarProps {
  type: "success" | "fail" | "warning";
  message: string;
}

const SnackBarType = {
  success: {
    color: "success",
    icon: "lets-icons:check-fill",
  },

  warning: {
    color: "warning",
    icon: "mdi:cross-circle",
  },
  failed: {
    color: "danger",
    icon: "mingcute:warning-fill",
  },
} as const;

export default function SnackBar() {
  const { openState, message, hide } = useSnackbar();
  return (
    <Snackbar
      variant="soft"
      color={SnackBarType[message.type].color}
      open={openState}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      startDecorator={<Icon icon={SnackBarType[message.type].icon}/>}
      endDecorator={
        <Button onClick={() => hide()} size="sm" variant="soft" color="success">
          Dismiss
        </Button>
      }
    >
      {message.message}
    </Snackbar>
  );
}
