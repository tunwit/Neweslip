import { z } from "zod";

export const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  nickName: z.string().min(1, "Nick name is required"),
  gender: z.enum(["male", "female", "others"]),
  dateOfBirth: z.date({ required_error: "Birth date is required" }),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});
