
import { Invitation } from "@/types/invitation";
import { ApiResponse } from "@/types/response";
import { Shop } from "@/types/shop";
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import { keepPreviousData, useQuery, UseQueryResult, useSuspenseQuery } from "@tanstack/react-query";
import { Session } from "inspector/promises";

export const useInvitation = (token:string|null) => {
  const query = useQuery<ApiResponse<Invitation>>({
    queryKey: ["invitations"],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/invitations/${token}`,
        method: "GET",
      }),
    refetchOnWindowFocus: true,
    enabled:token !== null ,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
