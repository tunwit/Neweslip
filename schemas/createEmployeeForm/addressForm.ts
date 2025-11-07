import { z } from "zod";

export const addressSchema = z.object({
  address1: z.string().optional(),
  address2: z.string().optional(),
  address3: z.string().optional(),
});
