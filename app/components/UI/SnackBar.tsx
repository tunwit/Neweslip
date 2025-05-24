"use Client";
import CheckIcon from "@/assets/icons/CheckIcon";
import { useSnackbar } from "@/hooks/useSnackBar";
import { Button, Snackbar } from "@mui/joy";
import React from "react";

interface SnackBarProps {
  type: "success" | "fail" | "warning";
  message: string;
}

const SnackBarType = {
  success: {
    color: "success",
    icon: CheckIcon,
  },

  warning: {
    color: "warning",
    icon: CheckIcon,
  },
  failed: {
    color: "danger",
    icon: CheckIcon,
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
      startDecorator={<CheckIcon />}
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
