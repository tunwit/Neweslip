// In @/schemas/setting/PenaltyFieldForm

import { PENALTY_METHOD, PENALTY_TYPE } from "@/types/enum/enum.penalty";
import { z } from "zod";

export const PenaltyFieldSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameEng: z.string().min(1, "Name English is required"),
  type: z.nativeEnum(PENALTY_TYPE),
  method: z.nativeEnum(PENALTY_METHOD),
  fixedAmount: z.nullable(z.string()),
});
