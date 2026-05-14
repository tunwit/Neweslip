import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { ValidationResultDTO } from "@/types/payroll/type.validate";
import { ApiResponse } from "@/types/response";
import { CreateBatch } from "@/types/type.batch";
import {
  NewPeriodDTO,
  PeriodFilterContextDTO,
  PeriodPublicDTO,
  PeriodSummaryDTO,
  PeriodWithBreakdownsDTO,
  PeriodWithCountDTO,
  SendPayslipEmailDTO,
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
import { number } from "zod";

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

export function usePeriodValidate(periodId?: number | string) {
  const { id: shopId } = useCurrentShop();

  return useQuery<ApiResponse<ValidationResultDTO[]>>({
    queryKey: ["period", shopId, periodId, "validate"],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/validate`,
        method: "GET",
      }),
    enabled: !!shopId && !!periodId,
  });
}

export function usePeriod(periodId?: number | string) {
  const { id: shopId } = useCurrentShop();
  const queryClient = useQueryClient();
  const queryKeyList = ["periods", shopId];
  const queryKey = ["period", shopId, periodId];
  const queryValidateKey = ["period", shopId, periodId, "validate"];
  const queryKeyEntries = ["entries", periodId];
  const queryKeyWithCal = ["period", shopId, periodId, "withCal"];
  const queryKeyFilterContext = ["period", shopId, periodId, "context"];

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
        endpoint: `/shops/${shopId}/periods/${periodId}?include=calculation`,
        method: "GET",
      }),
    enabled: !!shopId && !!periodId,
  });

  const getFilterContext = useQuery<ApiResponse<PeriodFilterContextDTO>>({
    queryKey: queryKeyFilterContext,
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}?include=calculation,fields,breakdowns`,
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
  return {
    get,
    update,
    getWithCal,
    getFilterContext,
    finalize,
    unlock,
  };
}

export function usePeriodSlips(periodId: number) {
  const { id: shopId } = useCurrentShop();
  const queryKey = ["periods", "pay-slip", periodId];
  const queryClient = useQueryClient();
  const zip = useMutation<
    { blob: Blob; filename: string },
    Error,
    { payload: { entryIds: number[] } }
  >({
    mutationFn: async ({ payload }) => {
      const res = (await fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/pay-slips/export/zip`,
        method: "POST",
        body: payload,
        responseType: "blob",
      })) as Response;
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      const filename =
        disposition?.match(/filename="?(.+?)"?$/)?.[1] ?? "payslip.zip";

      return { blob, filename };
    },
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      window.URL.revokeObjectURL(url);
    },
  });

  const excel = useMutation({
    mutationFn: async () => {
      return await fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/pay-slips/export/excel`,
        method: "POST",
      });
    },
  });

  const sendEmail = useMutation<
    ApiResponse<CreateBatch>,
    Error,
    { payload: SendPayslipEmailDTO }
  >({
    mutationFn: async ({ payload }) => {
      return fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/pay-slips/send-email`,
        method: "POST",
        body: { toSend: payload },
      });
    },
  });
  return { zip, excel, sendEmail };
}
