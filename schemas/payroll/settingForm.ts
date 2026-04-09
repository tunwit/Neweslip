import { z } from "zod";

export const payrollSettingForm = z.object({
  work_hour_per_day: z
    .number({ required_error: "Work hour / day is Required" })
    .gte(0, "Work hour must >= 0")
    .lte(24, "Work hour must <= 24"),
  work_day_per_month: z
    .number({ required_error: "Work day / month is Required" })
    .gte(0, "Work day must >= 0")
    .lte(31, "Work day must <= 31"),
});
