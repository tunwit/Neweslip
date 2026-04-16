import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { ValidationResultDTO } from "@/types/payroll/type.validate";
import { ApiResponse } from "@/types/response";
import {
  NewPeriodDTO,
  PeriodPublicDTO,
  PeriodSummaryDTO,
  PeriodWithCountDTO,
  UnlockPeriodDTO,
  UpdatePeriodDTO,
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
  const queryClient = useQueryClient();
  const queryKeyList = ["periods", shopId];
  const queryKey = ["period", shopId, periodId];
  const queryValidateKey = ["period", shopId, periodId, "validate"];
  const queryKeyEntries = ["entries", periodId];
  const queryKeyWithCal = ["period", shopId, periodId, "withCal"];

  const get = useQuery<ApiResponse<PeriodWithCountDTO>>({
    queryKey: queryKey,
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}`,
        method: "GET",
      }),
    enabled: !!shopId && !!periodId,
  });

  const getWithCal = useQuery<ApiResponse<PeriodSummaryDTO>>({
    queryKey: queryKeyWithCal,
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}?withCal=true`,
        method: "GET",
      }),
    enabled: !!shopId && !!periodId,
  });

  const validate = useQuery<ApiResponse<ValidationResultDTO[]>>({
    queryKey: queryValidateKey,
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/validate`,
        method: "GET",
      }),
    enabled: !!shopId && !!periodId,
  });

  const update = useMutation<
    ApiResponse<PeriodPublicDTO>,
    Error,
    { payload: UpdatePeriodDTO }
  >({
    mutationFn: ({ payload }) => {
      return fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}`,
        method: "PATCH",
        body: payload,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKeyEntries });
    },
  });

  const finalize = useMutation<ApiResponse<PeriodPublicDTO>, Error>({
    mutationFn: () => {
      return fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/finalize`,
        method: "POST",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKeyEntries });
      queryClient.invalidateQueries({ queryKey: queryValidateKey });
      queryClient.invalidateQueries({ queryKey: queryKeyList });
    },
  });

  const unlock = useMutation<
    ApiResponse<PeriodPublicDTO>,
    Error,
    { payload: UnlockPeriodDTO }
  >({
    mutationFn: ({ payload }) => {
      return fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/unlock`,
        method: "POST",
        body: payload,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKeyEntries });
      queryClient.invalidateQueries({ queryKey: queryValidateKey });
      queryClient.invalidateQueries({ queryKey: queryKeyList });
    },
  });
  return { get, validate, update, getWithCal, finalize, unlock };
}
