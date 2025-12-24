import { GENDER } from "@/types/enum/enum";
import { z } from "zod";

export const personalSchema = z.object({
  avatar: z.instanceof(File).optional(),
  firstName: z.string(),
  lastName: z.string().min(1, "Last name is required"),
  nickName: z.string().min(1, "Nick name is required"),
  gender: z.nativeEnum(GENDER),
  dateOfBirth: z.date({ required_error: "Birth date is required" }),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});
