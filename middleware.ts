import withAuth, { NextRequestWithAuth } from "next-auth/middleware";
import { jwtVerify } from "jose";
import { JWT } from "next-auth/jwt";
import { decode } from "./utils/jwt/decode";
import { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const url = req.nextUrl.clone();
    // const shopslug = url.pathname.split("/")[1];
    // const parts  = shopslug.split("-");
    // parts[parts.length - 1]
  },
  {
    jwt: {
      decode: decode,
    },
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  },
);
