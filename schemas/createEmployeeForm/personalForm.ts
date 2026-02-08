import { GENDER } from "@/types/enum/enum";
import { z } from "zod";

export const personalWithAvatarSchema = z.object({
  avatar: z.instanceof(File).optional(),
  firstName: z.string(),
  lastName: z.string().min(1, "Last name is required"),
  nickName: z.string().min(1, "Nick name is required"),
  gender: z.nativeEnum(GENDER),
  dateOfBirth: z.date({ required_error: "Birth date is required" }),
  email: z.string().email("Invalid email"),
  phoneNumber: z
    .string()
    .trim()
    .min(9, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
});

export const personalSchema = z.object({
  firstName: z.string(),
  lastName: z.string().min(1, "Last name is required"),
  nickName: z.string().min(1, "Nick name is required"),
  gender: z.nativeEnum(GENDER),
  dateOfBirth: z.date({ required_error: "Birth date is required" }),
  email: z.string().email("Invalid email"),
  phoneNumber: z
    .string()
    .trim()
    .min(9, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
});
