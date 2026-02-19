import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { ApiResponse } from "@/types/response";
import { EntryPublicDTO, EntryWithTotalDTO } from "@/types/type.entry";
import { fetchwithauth } from "@/utils/fetcher";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function useEntry(periodId: number) {
  const { id: shopId } = useCurrentShop();
  const queryClient = useQueryClient();
  const queryKey = ["periods", shopId];
  const list = useQuery<ApiResponse<EntryWithTotalDTO[]>>({
    queryKey,
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/entries`,
        method: "GET",
      }),
    enabled: shopId != null,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return { list };
}
