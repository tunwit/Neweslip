import { Employee } from "@/types/employee";
import { create } from "zustand";

interface SelectEmployeesState {
  selectedEmployees: Employee[];
  setEmployees: (newcheckboxs: Employee[]) => void;
  add: (employees: Employee[]) => void;
  remove: (employeeIds: string[]) => void;
}

//Button that close/open sidebar
const createSelecteKit = () =>
  create<SelectEmployeesState>((set) => ({
    selectedEmployees: [],
    setEmployees: (employees) => {
      set({ selectedEmployees: employees });
    },
    add: (employees) =>
      set((state) => ({
        selectedEmployees: [...state.selectedEmployees, ...employees],
      })),
    remove: (employeeIds) =>
      set((state) => ({
        selectedEmployees: state.selectedEmployees.filter(
          (e) => !employeeIds.includes(e.id),
        ),
      })),
  }));

export const useSelectedEmployees = createSelecteKit();
