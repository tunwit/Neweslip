import { z } from "zod";

export const overviewSchema = z.object({
  name: z.string().max(50, "Field name cannot exceed 50 charecter"),
  taxId: z
    .string()
    .length(13, "Tax Id must be 13 digit")
    .optional()
    .or(z.literal("")),
  work_hours_per_day: z
    .number({ required_error: "Work hour / day is Required" })
    .gte(0, "Work hour must >= 0"),
  workdays_per_month: z
    .number({ required_error: "Work day / month is Required" })
    .gte(0, "Work day must >= 0"),
});
