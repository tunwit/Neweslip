import { fetchwithauth } from "@/utils/fetcher";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Session } from "inspector/promises";
import { getSession, useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session, status } = useSession();

  const query = useSuspenseQuery({
    queryKey: ["auth", session?.user?.email],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/user?email=${session?.user?.email}`,
        method: "GET",
      }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
