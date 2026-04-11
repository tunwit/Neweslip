import { CompensationValuePublicDTO } from "./payroll/type.compensation";
import { OTValuePublicDTO } from "./payroll/type.ot";
import { PenaltyValuePublicDTO } from "./payroll/type.penalty";
import { CalculationContext } from "./type.calculation";

export type EntryPublicDTO = {
  id: number;
  salary: string;
  note: string | null;
  employee: {
    id: number;
    avatar?: string | null;
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

export type EntrySummaryDTO = {
  earningTotal: number;
  deductionTotal: number;
  overtimeTotal: number;
  penaltyTotal: number;
  netTotal: number;
};

export type EntryBreakDownDTO = {
  entry: EntryPublicDTO;
  items: PayrollItemsDTO;
  calculation: CalculationContext;
};

export type NewEntryDTO = {
  employeeIds: number[];
};

export type UpdateBreakDownDTO = {
  entry: {
    salary?: EntryPublicDTO["salary"];
    note?: EntryPublicDTO["note"];
  };
  items: {
    earnings?: Pick<CompensationValuePublicDTO, "id" | "amount">[] | undefined;
    deductions?:
      | Pick<CompensationValuePublicDTO, "id" | "amount">[]
      | undefined;
    non_calculated?:
      | Pick<CompensationValuePublicDTO, "id" | "amount">[]
      | undefined;
    ots?: Pick<OTValuePublicDTO, "id" | "value">[] | undefined;
    penalties?: Pick<PenaltyValuePublicDTO, "id" | "value">[] | undefined;
  };
};
