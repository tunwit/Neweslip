import { PAY_PERIOD_STATUS } from "./enum/enum.period";

export type PeriodPublicDTO = {
  id: number;
  name: string;
  status: PAY_PERIOD_STATUS;
  updatedAt: Date | null;
  start_period: Date;
  end_period: Date;
  edited: boolean | null;
};

export type PeriodSummaryDTO = PeriodPublicDTO & {
  totalNet: number;
  employeeCount: number;
};
