
import { Owner } from "@/types/owner";
import { ApiResponse } from "@/types/response";
import { Shop } from "@/types/shop";
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import { keepPreviousData, useQuery, UseQueryResult, useSuspenseQuery } from "@tanstack/react-query";
import { Session } from "inspector/promises";

export const useOwners = (shopId:number) => {
  const { session } = useSession();
  const query = useQuery<ApiResponse<Owner[]>>({
    queryKey: ["owners", session?.user?.emailAddresses],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/owners?shopId=${shopId}`,
        method: "GET",
      }),
    placeholderData:keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
