import { addressSchema } from "@/schemas/createEmployeeForm/addressForm";
import { contractSchema } from "@/schemas/createEmployeeForm/contractForm";
import { personalSchema } from "@/schemas/createEmployeeForm/personalForm";
import { z } from "zod";

export const createEmployeeFormSchema = personalSchema
    .merge(addressSchema)
    .merge(contractSchema);
export type createEmployeeFormField = z.infer<typeof createEmployeeFormSchema>; 