import { CompensationValuePublicDTO } from "./payroll/type.compensation";
import { OTValuePublicDTO } from "./payroll/type.ot";
import { PenaltyValuePublicDTO } from "./payroll/type.penalty";
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

export type PayrollItemsDTO = {
  earnings: CompensationValuePublicDTO[];
  deductions: CompensationValuePublicDTO[];
  non_calculated: CompensationValuePublicDTO[];
  ots: OTValuePublicDTO[];
  penalties: PenaltyValuePublicDTO[];
};

export type PayrollItemsWithSummaryDTO = PayrollItemsDTO & {
  summary: {
    earningTotal: number;
    deductionTotal: number;
    overtimeTotal: number;
    penaltyTotal: number;
    netTotal: number;
  };
};

export type NewEntryDTO = {
  employeeIds: number[];
};
