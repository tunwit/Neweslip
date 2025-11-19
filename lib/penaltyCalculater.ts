import { OT_METHOD, OT_TYPE, PENALTY_METHOD, PENALTY_TYPE } from "@/types/enum/enum";
import Decimal from "decimal.js";

function calculateRate(type: PENALTY_TYPE, salary: Decimal, workDayPerMonth: Decimal, hourPerDay: Decimal, rateOfPay: Decimal) {
    if (type === PENALTY_TYPE.BASEDONSALARY) {
        return salary.div(workDayPerMonth.mul(hourPerDay)); // hourly rate
    } else {
        return rateOfPay; // constant rate
    }
}

export function calculatePenalty(
    value: number, 
    type: PENALTY_TYPE, 
    method: PENALTY_METHOD, 
    rateOfPay?: string | null
) {
    const hourPerDay = new Decimal(8);
    const workDayPerMonth = new Decimal(30);
    const salary = new Decimal(16470); // you can pass this dynamically later
    const decimalRateOfPay = new Decimal(rateOfPay ?? 0);

    let baseRate = calculateRate(type, salary, workDayPerMonth, hourPerDay, decimalRateOfPay);
    
    switch (method) {
        case PENALTY_METHOD.PERMINUTE:
            if (type === PENALTY_TYPE.BASEDONSALARY) {
                baseRate = baseRate.div(60);
            }
            break;
        case PENALTY_METHOD.HOURLY:
            break;
        case PENALTY_METHOD.DAILY:
            if (type === PENALTY_TYPE.BASEDONSALARY) {
                baseRate = baseRate.mul(hourPerDay);
            }
            break;
        default:
            throw new Error("Unknown penalty method");
    }
    const result = new Decimal(value).mul(baseRate)
    return Number(result.toFixed(2));
}