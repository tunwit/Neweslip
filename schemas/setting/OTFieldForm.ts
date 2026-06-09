import {
  OT_METHOD,
  OT_TYPE,
} from "@/types/enum/enum";
import { z } from "zod";

export const OTFieldSchema = z.object({
  name: z.string().max(50, "Field name cannot exceed 50 charecter"),
  nameEng: z.string().max(50, "Field name cannot exceed 50 charecter"),
  type: z.nativeEnum(OT_TYPE),
  method: z.nativeEnum(OT_METHOD),
  multiplier: z.string(),
  fixedAmount: z.string().nullable(),
});
