import { useCurrentShop } from "./shop/useCurrentShop";
import { ApiResponse } from "@/types/response";
import { EmployeeDetailedDTO } from "@/types/type.employee";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchwithauth } from "@/utils/fetcher";
import {
  EmployeeDocumentPublicDTO,
  GetPresignDTO,
  NewEmployeeDocumentDTO,
  RenameEmployeeDocumentDTO,
} from "@/types/type.employee.document";
import { useUser } from "@clerk/nextjs";
import { usePreview } from "./payroll/record/usePreview";

type CreateEmployeeDocumentsVars = {
  employeeId: number;
  payload: NewEmployeeDocumentDTO;
};

type RenameEmployeeDocumentsVars = {
  employeeId: number;
  documentId: number;
  payload: RenameEmployeeDocumentDTO;
};

type DeleteEmployeeDocumentsVars = {
  employeeId: number;
  documentId: number;
};

type GetPresignEmployeeDocumentsVars = {
  employeeId: number;
  download?: boolean;
  payload: GetPresignDTO;
};

export const useEmployeeDocuments = (employeeId: number) => {
  const { id: shopId } = useCurrentShop();
  const query = useQuery<ApiResponse<EmployeeDocumentPublicDTO[]>>({
    queryKey: ["employees", "documents", employeeId],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/employees/${employeeId}/documents`,
        method: "GET",
      }),
    enabled: shopId != null && employeeId != null,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};

export function useEmployeeDocument() {
  const { id: shopId } = useCurrentShop();
  return useMutation<
    ApiResponse<{ url: string }>,
    Error,
    GetPresignEmployeeDocumentsVars
  >({
    mutationFn: ({ employeeId, download = false, payload }) =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/employees/${employeeId}/documents/${payload.id}?download=${download}`,
        method: "GET",
      }),
  });
}

export function useCreateEmployeeDocument() {
  const queryClient = useQueryClient();
  const { id: shopId } = useCurrentShop();
  const { user } = useUser();

  return useMutation<
    EmployeeDocumentPublicDTO[],
    Error,
    CreateEmployeeDocumentsVars,
    { previousDocuments?: ApiResponse<EmployeeDocumentPublicDTO[]> }
  >({
    mutationFn: ({ employeeId, payload }) => {
      const formData = new FormData();
      formData.set("tag", payload.tag);
      payload.files.forEach((file) => {
        formData.append("files", file);
      });

      return fetchwithauth({
        endpoint: `/shops/${shopId}/employees/${employeeId}/documents`,
        method: "POST",
        body: formData,
      });
    },
    onSettled: (_data, _error, { employeeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["employees", "documents", employeeId],
      });
    },
  });
}

export function useRenameEmployeeDocument() {
  const queryClient = useQueryClient();
  const { id: shopId } = useCurrentShop();

  return useMutation<
    EmployeeDocumentPublicDTO,
    Error,
    RenameEmployeeDocumentsVars,
    { previousDocuments?: ApiResponse<EmployeeDocumentPublicDTO[]> }
  >({
    mutationFn: ({ employeeId, documentId, payload }) =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/employees/${employeeId}/documents/${documentId}/rename`,
        method: "PATCH",
        body: payload,
      }),

    onMutate: async ({ employeeId, documentId, payload }) => {
      await queryClient.cancelQueries({
        queryKey: ["employees", "documents", employeeId],
      });

      const previousDocuments = queryClient.getQueryData<
        ApiResponse<EmployeeDocumentPublicDTO[]>
      >(["employees", "documents", employeeId]);

      queryClient.setQueryData<ApiResponse<EmployeeDocumentPublicDTO[]>>(
        ["employees", "documents", employeeId],
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

      return { previousDocuments };
    },

    onError: (_err, { employeeId }, context) => {
      if (context?.previousDocuments) {
        queryClient.setQueryData(
          ["employees", "documents", employeeId],
          context.previousDocuments,
        );
      }
    },

    onSettled: (_data, _error, { employeeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["employees", "documents", employeeId],
      });
    },
  });
}

export function useDeleteEmployeeDocument() {
  const queryClient = useQueryClient();
  const { id: shopId } = useCurrentShop();
  return useMutation<
    EmployeeDocumentPublicDTO,
    Error,
    DeleteEmployeeDocumentsVars,
    {
      previousDocuments?: ApiResponse<EmployeeDocumentPublicDTO[]>;
    }
  >({
    mutationFn: ({ employeeId, documentId }) =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/employees/${employeeId}/documents/${documentId}`,
        method: "DELETE",
      }),

    onMutate: async ({ employeeId, documentId }) => {
      await queryClient.cancelQueries({
        queryKey: ["employees", "documents", employeeId],
      });

      const previousDocuments = queryClient.getQueryData<
        ApiResponse<EmployeeDocumentPublicDTO[]>
      >(["employees", "documents", employeeId]);

      queryClient.setQueryData<ApiResponse<EmployeeDocumentPublicDTO[]>>(
        ["employees", "documents", employeeId],
        (old) => {
          if (!old) return old;
          return { ...old, data: old?.data?.filter((o) => o.id != documentId) };
        },
      );

      return { previousDocuments };
    },

    onError: (_err, { employeeId }, context) => {
      if (context?.previousDocuments) {
        queryClient.setQueryData(
          ["employees", "documents", employeeId],
          context.previousDocuments,
        );
      }
    },

    onSettled: (_data, _error, { employeeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["employees", "documents", employeeId],
      });
    },
  });
}
