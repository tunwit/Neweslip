import { create } from "zustand";

interface HamburgerState {
  open: boolean;
  toggle: () => void;
}

//Button that close/open sidebar
const useHamburger = create<HamburgerState>((set) => ({
  open: true,
  toggle: () => set((state) => ({ open: !state.open })),
}));

export default useHamburger;
