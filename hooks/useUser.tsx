import { fetchwithauth } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import { getSession, useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session, status } = useSession();
  const query = useQuery({
    queryKey: ["auth", "test"],
    queryFn: fetchwithauth,
  });
  // console.log(query);

  return query;
};
