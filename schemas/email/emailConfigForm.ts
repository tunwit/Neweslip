import { z } from "zod";

export const emailConfigForm = z.object({
  SMTPHost: z.string().max(255, "SMTPHost cannot exceed 255 charecter"),
  SMTPPort: z.number(),
  SMTPSecure: z.boolean(),
  emailName: z.string().max(255, "Email Name cannot exceed 255 charecter"),
  emailAddress: z
    .string()
    .max(255, "Email Address cannot exceed 255 charecter"),
  emailPassword: z
    .string()
    .max(255, "Email Password cannot exceed 255 charecter"),
});
