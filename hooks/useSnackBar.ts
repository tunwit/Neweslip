import { create } from "zustand";

interface SnackbarStore {
  openState: boolean;
  message: { message: string; type: "success" | "failed" | "warning" };
  show: (duration?: number) => void;
  hide: () => void;
  setMessage: (args: {
    message: string;
    type: "success" | "failed" | "warning";
  }) => void;
}

export const useSnackbar = create<SnackbarStore>((set) => ({
  openState: false,
  message: { message: "", type: "success" },
  show: (duration = 3000) => {
    set({ openState: true });

    setTimeout(() => {
      set({ openState: false });
    }, duration);
  },
  hide: () => set({ openState: false }),
  setMessage: (args) => {
    set({ message: { message: args.message, type: args.type } });
  },
}));
