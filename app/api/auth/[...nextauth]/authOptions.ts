import GoogleProvider from "next-auth/providers/google";
import { encode } from "@/utils/jwt/encode";
import { decode } from "@/utils/jwt/decode";
import { verifyUser } from "@/utils/auth/verifyUser";
import { NextAuthOptions } from "next-auth";
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, //30 days
  },
  jwt: {
    encode: encode,
    decode: decode,
    maxAge: 60 * 60 * 24 * 1, //1 days
  },

  callbacks: {
    async signIn({ user, account, profile }: any) {
      return true;
    },
    async jwt({ token, account }: any) {
      const email = token.email;
      if (!email) {
        return null;
      }
      const data = await verifyUser(email);
      if (!data.verify) {
        console.log("null returned");

        return null;
      }
      token.userId = data.user.id;
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.userId;
      return session;
    },
  },
} satisfies NextAuthOptions;
