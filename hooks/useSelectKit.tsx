import { EmployeeRespounse } from "@/types/employee";
import { create } from "zustand";

interface SelectKitState<T extends { id: number }> {
  checkboxs: Record<number, boolean>;
  setCheckboxs: (newCheckboxs: Record<number, boolean>) => void;
  uncheckall: () => void;
  checkall: () => void;
  updateAtId: (id: number) => void;

  checkedItem: T[];
  setItem: (newItems: T[]) => void;
  add: (newItems: T[]) => void;
  remove: (itemIds: number[]) => void;
}

const createSelectKit = <T extends { id: number }>() =>
  create<SelectKitState<T>>((set) => ({
    checkboxs: {},
    setCheckboxs: (newCheckboxs) => set({ checkboxs: newCheckboxs }),
    uncheckall: () =>
      set((state) => ({
        checkboxs: Object.fromEntries(
          Object.keys(state.checkboxs).map((key) => [Number(key), false])
        ),
        checkedItem: [],
      })),
    checkall: () =>
      set((state) => ({
        checkboxs: Object.fromEntries(
          Object.keys(state.checkboxs).map((key) => [Number(key), true])
        ),
      })),
    updateAtId: (id) =>
      set((state) => ({
        checkboxs: { ...state.checkboxs, [id]: !state.checkboxs[id] },
      })),

    checkedItem: [],
    setItem: (newItems) => set({ checkedItem: newItems }),
    add: (newItems) =>
      set((state) => ({
        checkedItem: [...state.checkedItem, ...newItems],
      })),
    remove: (itemIds) =>
      set((state) => ({
        checkedItem: state.checkedItem.filter((e) => !itemIds.includes(e.id)),
      })),
  }));

// Create hooks
export const useAllSelectKit = createSelectKit<EmployeeRespounse>();
export const usePayrollSelectKit = createSelectKit<EmployeeRespounse>();
export const useEmployeeSelectKit = createSelectKit<EmployeeRespounse>();
