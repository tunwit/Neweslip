import { Owner } from "@/types/owner";
import { ApiResponse } from "@/types/response";
import { fetchwithauth } from "@/utils/fetcher";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCurrentShop } from "./shop/useCurrentShop";

export const useOwners = () => {
  const { id: shopId } = useCurrentShop();
  const query = useQuery<ApiResponse<Owner[]>>({
    queryKey: ["owners"],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/owners`,
        method: "GET",
      }),
    enabled: shopId != null,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};
