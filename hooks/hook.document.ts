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
  CreateDocResultDTO,
  DocumentUploadTargetDTO,
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
    ApiResponse<CreateDocResultDTO[]>,
    Error,
    { payload: NewDocumentDTO }
  >({
    mutationFn: async ({ payload }) => {
      const targets = await fetchwithauth({
        endpoint: `${basePath}/uploads/presign`,
        method: "POST",
        body: {
          tag: payload.tag,
          files: payload.files.map((file) => ({
            fileName: file.name,
            mimeType: file.type,
            size: file.size,
          })),
        },
      });

      const uploaded = await Promise.all(
        (targets.data as DocumentUploadTargetDTO[]).map(async (target, index) => {
          const file = payload.files[index];
          if (!file) {
            return {
              fileName: target.fileName,
              tag: payload.tag,
              mimeType: "",
              size: 0,
              uploadedBy: "",
              metadata: null,
              success: false,
              errorMessage: "Upload file is missing",
            };
          }

          const response = await fetch(target.uploadUrl, {
            method: "PUT",
            headers: target.headers,
            body: file,
          });
          if (!response.ok) {
            return {
              fileName: file.name,
              tag: payload.tag,
              mimeType: file.type,
              size: file.size,
              uploadedBy: "",
              metadata: null,
              success: false,
              errorMessage: `R2 upload failed (${response.status})`,
            };
          }
          return { key: target.key, fileName: file.name };
        }),
      );

      const failures = uploaded.filter((result) => !("key" in result));
      const completed = uploaded.filter(
        (result): result is { key: string; fileName: string } => "key" in result,
      );
      if (completed.length === 0) {
        return { success: true, data: failures };
      }

      const completion = await fetchwithauth({
        endpoint: `${basePath}/uploads/complete`,
        method: "POST",
        body: { tag: payload.tag, files: completed },
      });
      return {
        ...completion,
        data: [...failures, ...(completion.data ?? [])],
      };
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
