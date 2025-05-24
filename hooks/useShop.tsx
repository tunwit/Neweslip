import { fetchwithauth } from "@/utils/fetcher";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Session } from "inspector/promises";
import { getSession, useSession } from "next-auth/react";

export const useShop = () => {
  const { data, status } = useSession();
  const query = useSuspenseQuery({
    queryKey: ["shop", data?.user?.email],
    queryFn: () =>
      fetchwithauth({
        endpoint: "/shop",
        method: "GET",
      }),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
