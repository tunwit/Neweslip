import { SignJWT } from "jose";
import { JWTEncodeParams } from "next-auth/jwt";

export const encode = async ({
  token,
  secret,
  maxAge,
}: JWTEncodeParams): Promise<string> => {
  // return a custom encoded JWT string
  const secretKey = new TextEncoder().encode(secret as string);
  const jwt = await new SignJWT(token)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAge!) // Expiry time
    .sign(secretKey); // Sign with secret key

  return jwt;
};
