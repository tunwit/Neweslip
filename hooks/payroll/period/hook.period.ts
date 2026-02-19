import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { ApiResponse } from "@/types/response";
import {
  NewPeriodDTO,
  PeriodPublicDTO,
  PeriodSummaryDTO,
} from "@/types/type.period";
import { fetchwithauth } from "@/utils/fetcher";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export function usePeriods() {
  const { id: shopId } = useCurrentShop();
  const queryClient = useQueryClient();
  const queryKey = ["periods", shopId];

  const list = useQuery<ApiResponse<PeriodSummaryDTO[]>>({
    queryKey,
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/periods`,
        method: "GET",
      }),
    enabled: shopId != null,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const create = useMutation<
    ApiResponse<PeriodPublicDTO>,
    Error,
    { payload: NewPeriodDTO }
  >({
    mutationFn: ({ payload }) => {
      return fetchwithauth({
        endpoint: `/shops/${shopId}/periods`,
        method: "POST",
        body: payload,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const remove = useMutation<
    PeriodPublicDTO,
    Error,
    { ids: number[] },
    { previous?: ApiResponse<PeriodPublicDTO[]> }
  >({
    mutationFn: ({ ids }) =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/periods`,
        method: "DELETE",
        body: { ids: ids },
      }),

    onMutate: async ({ ids }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous =
        queryClient.getQueryData<ApiResponse<PeriodPublicDTO[]>>(queryKey);

      queryClient.setQueryData<ApiResponse<PeriodPublicDTO[]>>(
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

export function usePeriod(periodId?: number | string) {
  const { id: shopId } = useCurrentShop();

  return useQuery<ApiResponse<PeriodSummaryDTO>>({
    queryKey: ["period", shopId, periodId],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}`,
        method: "GET",
      }),
    enabled: !!shopId && !!periodId,
    staleTime: 1000 * 60 * 5,
  });
}
