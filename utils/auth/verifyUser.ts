import { cookies } from "next/headers";
import { fetchNoAuth } from "../fetcher";

export const verifyUser = async (email: string) => {
  const res = await fetchNoAuth({
    endpoint: "/auth/verify",
    method: "POST",
    body: {
      email: email,
    },
  });
  return res;
};
