import { z } from "zod";

export const branchSchema = z.object({
  name: z.string().max(50,"Branch name cannot exceed 50 charecter"),
  nameEng: z.string().max(50,"Branch name cannot exceed 50 charecter")
});
