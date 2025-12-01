import { OT_METHOD, OT_TYPE } from "@/types/enum/enum";
import Decimal from "decimal.js";

function calculateRate(
  type: OT_TYPE,
  salary: Decimal,
  workDayPerMonth: Decimal,
  hourPerDay: Decimal,
  rateOfPay: Decimal,
) {
  let rate;
  if (type === OT_TYPE.BASEDONSALARY) {
    rate = salary.div(workDayPerMonth.mul(hourPerDay));
  } else {
    rate = rateOfPay;
  }
  return rate;
}

export function calculateOT(
  salary: Decimal,
  value: number,
  type: OT_TYPE,
  method: OT_METHOD,
  hourPerDay: Decimal,
  workDayPerMonth: Decimal,
  rate: string,
  rateOfPay?: string | null,
) {
  const decimalRateOfPay = new Decimal(rateOfPay ?? 0);
  const decimalRate = new Decimal(rate);

  let baseRate = calculateRate(
    type,
    salary,
    workDayPerMonth,
    hourPerDay,
    decimalRateOfPay,
  );
  if (method === OT_METHOD.DAILY) {
    if (type === OT_TYPE.BASEDONSALARY) {
      baseRate = baseRate.mul(hourPerDay); // daily rate
    }
  }

  const result = new Decimal(value).mul(baseRate).mul(decimalRate) || 0;

  return Number(result.toFixed(2));
}
