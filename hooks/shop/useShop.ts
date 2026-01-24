import { ApiResponse } from "@/types/response";
import { Shop } from "@/types/shop";
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Session } from "inspector/promises";

export const useShop = () => {
  const { session, isLoaded, isSignedIn } = useSession();
  const query = useQuery<ApiResponse<Shop[]>>({
    queryKey: ["shop", session?.user?.emailAddresses],
    queryFn: () =>
      fetchwithauth({
        endpoint: "/shops",
        method: "GET",
      }),
    enabled: isLoaded && isSignedIn,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
