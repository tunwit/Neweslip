import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import { ApiResponse } from "@/types/response";
import {
  EntryBreakDownDTO,
  EntryPublicDTO,
  EntryWithTotalDTO,
  NewEntryDTO,
  UpdateBreakDownDTO,
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

export function useEntryBreakdown(periodId: number, entryId: number) {
  const { id: shopId } = useCurrentShop();
  const queryKey = ["entries", "items", entryId];
  const queryKeyList = ["entries", periodId];
  const queryClient = useQueryClient();
  const get = useQuery<ApiResponse<EntryBreakDownDTO>>({
    queryKey,
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/entries/${entryId}/break-down`,
        method: "GET",
      }),
    enabled: shopId != null && periodId > 0 && entryId > 0,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const update = useMutation<
    ApiResponse<EntryBreakDownDTO>,
    Error,
    { payload: UpdateBreakDownDTO }
  >({
    mutationFn: ({ payload }) => {
      return fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/entries/${entryId}`,
        method: "PATCH",
        body: payload,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: queryKeyList });
    },
  });

  return { get, update };
}

export function useEntrySlip(periodId: number) {
  const { id: shopId } = useCurrentShop();
  const queryKey = ["entries", "pay-slip", periodId];
  const queryClient = useQueryClient();
  const get = (entryId: number) =>
    useMutation({
      mutationFn: async () => {
        const res = (await fetchwithauth({
          endpoint: `/shops/${shopId}/periods/${periodId}/entries/${entryId}/pay-slip`,
          method: "GET",
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

  return { get };
}

export const usePreviewSlip = (
  periodId: number,
  entryId: number,
) => {
  const { id: shopId } = useCurrentShop();
  return useQuery<ApiResponse<string>>({
    queryKey: ["preview", shopId, periodId, entryId],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/periods/${periodId}/entries/${entryId}/preview`,
        method: "GET",
      }),
    staleTime: 1000 * 60 * 5,
  });
};
