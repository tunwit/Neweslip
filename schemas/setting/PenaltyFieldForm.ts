// In @/schemas/setting/PenaltyFieldForm

import { z } from "zod";
import { PENALTY_TYPE, PENALTY_METHOD } from "@/types/enum/enum";

export const PenaltyFieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameEng: z.string().min(1, "Name English is required"),
  type: z.nativeEnum(PENALTY_TYPE),
  method: z.nativeEnum(PENALTY_METHOD),
  rateOfPay: z.string().optional(),
})