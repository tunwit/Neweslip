import { PAY_PERIOD_STATUS } from "./enum/enum.period";
import { CalculationContext } from "./type.calculation";

export type PeriodPublicDTO = {
  id: number;
  name: string;
  status: PAY_PERIOD_STATUS;
  updatedAt: Date | null;
  start_period: string;
  end_period: string;
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
