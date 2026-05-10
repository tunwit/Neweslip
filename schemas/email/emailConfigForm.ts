import { z } from "zod";

export const SMTPEmailConfigForm = z.object({
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

export const ResendEmailConfigForm = z.object({
  resend_api_key: z.string().max(255, "api key cannot exceed 255 charecter"),
  emailName: z.string().max(255, "Email Name cannot exceed 255 charecter"),
  emailAddress: z
    .string()
    .max(255, "Email Address cannot exceed 255 charecter"),
});
