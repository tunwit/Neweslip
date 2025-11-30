
import { ApiResponse } from "@/types/response";
import { Shop } from "@/types/shop";
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import { keepPreviousData, useQuery, UseQueryResult, useSuspenseQuery } from "@tanstack/react-query";
import { Session } from "inspector/promises";

export const useShopDetails = (shopId:number | null | undefined) => {
  const { session } = useSession();
  const query = useQuery<ApiResponse<Shop>>({
    queryKey: ["shop","details", session?.user?.emailAddresses],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shop/${shopId}`,
        method: "GET",
      }),
    refetchOnWindowFocus: true,
    enabled:shopId !== null && shopId !== undefined,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
