import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { ApiResponse } from "@/types/response";
import {
  EntryPublicDTO,
  EntryWithTotalDTO,
  NewEntryDTO,
  PayrollItemsWithSummaryDTO,
} from "@/types/type.entry";
import { fetchwithauth } from "@/utils/fetcher";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function useEntry(periodId: number) {
  const { id: shopId } = useCurrentShop();
  const queryKey = ["entries", periodId];
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
    onSuccess: (data) => {
      console.log("created:", data);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const remove = useMutation<
    EntryPublicDTO,
    Error,
    { ids: number[] },
    { previous?: ApiResponse<EntryPublicDTO[]> }
  >({
    mutationFn: ({ ids }) =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/entries`,
        method: "DELETE",
        body: { ids: ids },
      }),

    onMutate: async ({ ids }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous =
        queryClient.getQueryData<ApiResponse<EntryPublicDTO[]>>(queryKey);

      queryClient.setQueryData<ApiResponse<EntryPublicDTO[]>>(
        queryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data?.filter((d) => !ids.includes(d.id)),
          };
        },
      );

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKey, ctx.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
  return { list, create, remove };
}

export function useEntryItems(periodId: number, entryId: number) {
  const { id: shopId } = useCurrentShop();
  const queryKey = ["entries", "items", entryId];
  const queryClient = useQueryClient();
  const get = useQuery<ApiResponse<PayrollItemsWithSummaryDTO>>({
    queryKey,
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/entries/${entryId}/payroll-items`,
        method: "GET",
      }),
    enabled: shopId != null,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return { get };
}
