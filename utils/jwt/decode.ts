import { jwtVerify } from "jose";
import { JWT, JWTDecodeParams } from "next-auth/jwt";

export const decode = async ({
  token,
  secret,
}: JWTDecodeParams): Promise<JWT | null> => {
  // return a `JWT` object, or `null` if decoding failed
  const secretKey = new TextEncoder().encode(secret as string);

  try {
    const { payload } = await jwtVerify(token!, secretKey);
    return payload;
  } catch (err) {
    console.error("Invalid JWT:", err);
    return null;
  }
};
