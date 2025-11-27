import { randomBytes } from "crypto";

export function generateToken() {
  return randomBytes(32).toString("hex"); // 64-char token
}