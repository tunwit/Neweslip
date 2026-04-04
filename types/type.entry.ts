import { CalculationContext } from "./type.calculation";

export type EntryPublicDTO = {
  id: number;
  salary: string;
  employee: {
    id: number;
    snapshot: {
      firstName: string;
      lastName: string;
      nickName: string;
      branch: {
        id: number;
        name: string;
        nameEng: string;
      };
    };
  };
  payslipSent: boolean | null;
  paidAt: Date | null;
};

export type EntryWithTotalDTO = EntryPublicDTO & CalculationContext;

export type NewEntryDTO = {
  employeeIds: number[];
};
