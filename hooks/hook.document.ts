import { useCurrentShop } from "./shop/useCurrentShop";
import { ApiResponse } from "@/types/response";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchwithauth } from "@/utils/fetcher";
import {
  DocumentPublicDTO,
  GetPresignDTO,
  NewDocumentDTO,
  RenameDocumentDTO,
} from "@/types/type.document";

type Scope = "shop" | "employee";

function getConfig(scope: Scope, shopId: number, entityId?: number) {
  if (scope === "shop") {
    return {
      queryKey: ["shops", "documents", shopId],
      basePath: `/shops/${shopId}/documents`,
    };
  }

  if (!entityId) {
    throw new Error("employeeId is required for employee documents");
  }

  return {
    queryKey: ["employees", "documents", entityId],
    basePath: `/shops/${shopId}/employees/${entityId}/documents`,
  };
}

export function useDocuments(scope: Scope, entityId?: number) {
  const { id: shopId } = useCurrentShop();
  const queryClient = useQueryClient();

  const { queryKey, basePath } = getConfig(scope, shopId!, entityId);

  /* ---------- List ---------- */
  const list = useQuery<ApiResponse<DocumentPublicDTO[]>>({
    queryKey,
    queryFn: () =>
      fetchwithauth({
        endpoint: basePath,
        method: "GET",
      }),
    enabled: shopId != null && (scope === "shop" || entityId != null),
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  /* ---------- Get presigned URL ---------- */
  const getPresign = useMutation<
    ApiResponse<{ url: string }>,
    Error,
    { payload: GetPresignDTO; download?: boolean }
  >({
    mutationFn: ({ payload, download = false }) =>
      fetchwithauth({
        endpoint: `${basePath}/${payload.id}?download=${download}`,
        method: "GET",
      }),
  });

  /* ---------- Create ---------- */
  const create = useMutation<
    DocumentPublicDTO[],
    Error,
    { payload: NewDocumentDTO }
  >({
    mutationFn: ({ payload }) => {
      const formData = new FormData();
      formData.set("tag", payload.tag);
      payload.files.forEach((file) => {
        formData.append("files", file);
      });

      return fetchwithauth({
        endpoint: basePath,
        method: "POST",
        body: formData,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  /* ---------- Rename (optimistic) ---------- */
  const rename = useMutation<
    DocumentPublicDTO,
    Error,
    { documentId: number; payload: RenameDocumentDTO },
    { previous?: ApiResponse<DocumentPublicDTO[]> }
  >({
    mutationFn: ({ documentId, payload }) =>
      fetchwithauth({
        endpoint: `${basePath}/${documentId}/rename`,
        method: "PATCH",
        body: payload,
      }),

    onMutate: async ({ documentId, payload }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous =
        queryClient.getQueryData<ApiResponse<DocumentPublicDTO[]>>(queryKey);

      queryClient.setQueryData<ApiResponse<DocumentPublicDTO[]>>(
        queryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data?.map((doc) =>
              doc.id === documentId
                ? { ...doc, fileName: payload.newName, editedAt: new Date() }
                : doc,
            ),
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

  /* ---------- Delete (optimistic) ---------- */
  const remove = useMutation<
    DocumentPublicDTO,
    Error,
    { documentId: number },
    { previous?: ApiResponse<DocumentPublicDTO[]> }
  >({
    mutationFn: ({ documentId }) =>
      fetchwithauth({
        endpoint: `${basePath}/${documentId}`,
        method: "DELETE",
      }),

    onMutate: async ({ documentId }) => {
      await queryClient.cancelQueries({ queryKey });

      const previous =
        queryClient.getQueryData<ApiResponse<DocumentPublicDTO[]>>(queryKey);

      queryClient.setQueryData<ApiResponse<DocumentPublicDTO[]>>(
        queryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data?.filter((d) => d.id !== documentId),
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

  return {
    list,
    getPresign,
    create,
    rename,
    remove,
  };
}
