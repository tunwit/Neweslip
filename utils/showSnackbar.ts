"use client"

import { useSnackbar } from "@/hooks/useSnackBar";

export const showSuccess = (message: string) => {
    const state = useSnackbar.getState()
    state.setMessage({ message: message, type: "success" });
    state.show();
  };

export const showError = (message: string) => {
    const state = useSnackbar.getState()
    state.setMessage({ message: message, type: "failed" });
    state.show();
  };

export const showWarning = (message: string) => {
    const state = useSnackbar.getState()
    state.setMessage({ message: message, type: "warning" });
    state.show();
  };