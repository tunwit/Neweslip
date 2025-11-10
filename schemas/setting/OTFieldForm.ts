import { OT_METHOD, OT_TYPE, SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import { string, z } from "zod";

export const OTFieldSchema = z.object({
  name: z.string().max(50,"Field name cannot exceed 50 charecter"),
  nameEng: z.string().max(50,"Field name cannot exceed 50 charecter"),
  type: z.nativeEnum(OT_TYPE),
  method:z.nativeEnum(OT_METHOD),
  rate: z.string(),
  rateOfPay: z.string().optional()
})