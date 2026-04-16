import { PAY_PERIOD_STATUS } from "./enum/enum.period";
import { CalculationContext } from "./type.calculation";
import { UserPublicDTO } from "./type.user";

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
  finalized_at: Date | null;
  finalized_by: UserPublicDTO | null;
};

export type PeriodWithCountDTO = PeriodPublicDTO & {
  employeeCount: number;
};
export type PeriodSummaryDTO = PeriodWithCountDTO & CalculationContext;

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

export type UnlockPeriodDTO = {
  password: string;
};
