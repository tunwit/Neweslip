import { z } from "zod";

export const changePasswordSchema = z.object({
  oldpassword: z
    .string()
    .min(4, "Password minimum length is 4")
    .max(8, "Password maximum length is 8"),
  newpassword: z
    .string()
    .min(4, "Password minimum length is 4")
    .max(8, "Password maximum length is 8"),
  confirmpassword: z
    .string()
    .min(4, "Password minimum length is 4")
    .max(8, "Password maximum length is 8"),
});
