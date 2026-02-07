import { z } from "zod";

export const changePasswordSchema = z.object({
  oldpassword: z
    .string()
    .min(4, "Password minimum length is 4")
    .max(255, "Password maximum length is 255"),
  newpassword: z
    .string()
    .min(4, "Password minimum length is 4")
    .max(255, "Password maximum length is 255"),
  confirmpassword: z
    .string()
    .min(4, "Password minimum length is 4")
    .max(255, "Password maximum length is 255"),
});
