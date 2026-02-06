import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import { COMPEN_FIELD_DEFINATION_TYPE } from "@/types/enum/enum.compensation";
import { string, z } from "zod";

export const salaryFieldSchema = z.object({
  name: z.string().max(50, "Field name cannot exceed 50 charecter"),
  nameEng: z.string().max(50, "Field name cannot exceed 50 charecter"),
  type: z.nativeEnum(COMPEN_FIELD_DEFINATION_TYPE),
  formular: z
    .string()
    .max(255, "Field name cannot exceed 50 charecter")
    .optional(),
});
