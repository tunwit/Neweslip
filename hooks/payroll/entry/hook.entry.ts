import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { ApiResponse } from "@/types/response";
import { EntryPublicDTO, EntryWithTotalDTO, NewEntryDTO } from "@/types/type.entry";
import { fetchwithauth } from "@/utils/fetcher";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function useEntry(periodId: number) {
  const { id: shopId } = useCurrentShop();
  const queryKey = ["pentries", periodId];
  const queryClient = useQueryClient();
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

  const create = useMutation<
    ApiResponse<EntryPublicDTO>,
    Error,
    { payload: NewEntryDTO }
  >({
    mutationFn: ({ payload }) => {
      return fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/entries`,
        method: "POST",
        body: payload,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { list, create };
}
