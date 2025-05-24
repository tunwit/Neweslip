import { Employee } from "@/types/employee";
import { create } from "zustand";

interface SelectKitState<T extends { id: string }> {
  checkboxs: Record<string, boolean>;
  setCheckboxs: (newcheckboxs: Record<string, boolean>) => void;
  uncheckall: () => void;
  checkall: () => void;
  updateAtId: (id: string) => void;

  checkedItem: T[];
  setItem: (newItems: T[]) => void;
  add: (newItems: T[]) => void;
  remove: (itemIds: string[]) => void;
}

//Button that close/open sidebar
const createSelecteKit = <T extends { id: string }>() =>
  create<SelectKitState<T>>((set) => ({
    checkboxs: {},
    setCheckboxs: (newcheckboxs) => {
      set({ checkboxs: newcheckboxs });
    },
    uncheckall: () =>
      set((state) => ({
        checkboxs: Object.fromEntries(
          Object.keys(state.checkboxs).map((key) => [key, false]),
        ),
        checkedEmployees: [],
      })),
    checkall: () =>
      set((state) => ({
        checkboxs: Object.fromEntries(
          Object.keys(state.checkboxs).map((key) => [key, true]),
        ),
      })),
    updateAtId: (id) => {
      set((state) => ({
        checkboxs: { ...state.checkboxs, [id]: !state.checkboxs[id] },
      }));
    },

    checkedItem: [],
    setItem: (newItems) => {
      set({ checkedItem: newItems });
    },
    add: (newItems) =>
      set((state) => ({
        checkedItem: [...state.checkedItem, ...newItems],
      })),
    remove: (itemIds) =>
      set((state) => ({
        checkedItem: state.checkedItem.filter((e) => !itemIds.includes(e.id)),
      })),
  }));

export const useAllSelectKit = createSelecteKit<Employee>();
export const usePayrollSelectKit = createSelecteKit<Employee>();
export const useEmployeeSelectKit = createSelecteKit<Employee>();
