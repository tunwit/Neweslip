
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Session } from "inspector/promises";

export const useShop = () => {
  const { session } = useSession();
  const query = useQuery({
    queryKey: ["shop", session?.user?.emailAddresses],
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
