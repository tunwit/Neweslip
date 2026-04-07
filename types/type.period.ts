import { PAY_PERIOD_STATUS } from "./enum/enum.period";
import { CalculationContext } from "./type.calculation";

export type PeriodPublicDTO = {
  id: number;
  name: string;
  status: PAY_PERIOD_STATUS;
  updatedAt: Date | null;
  start_period: string;
  end_period: string;
  work_hours_per_day: string;
  workdays_per_month: string;
  edited: boolean | null;
};

export type PeriodSummaryDTO = PeriodPublicDTO &
  CalculationContext & {
    employeeCount: number;
  };

export type NewPeriodDTO = {
  name: string;
  start_period: string;
  end_period: string;
};

export type UpdatePeriodDTO = {
  name?: string | undefined;
  start_period?: Date | undefined;
  end_period?: Date | undefined;
  work_hours_per_day?: string | null | undefined;
  workdays_per_month?: string | null | undefined;
};
