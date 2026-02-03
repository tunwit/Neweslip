import { BranchPublicDTO, NewBranchDTO } from "@/types/branch";
import { ApiResponse } from "@/types/response";
import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";

type CreateBranchVars = {
  shopId: number;
  payload: NewBranchDTO;
};

type UpdateBranchVars = {
  shopId: number;
  branchId: number;
  payload: NewBranchDTO;
};

type DeleteBranchVars = {
  shopId: number;
  ids: number[];
};

export const useBranches = () => {
  const pathname = usePathname().split("/");
  const slug = pathname[2];
  const data = extractSlug(slug);

  const query = useQuery<ApiResponse<BranchPublicDTO[]>>({
    queryKey: ["branch", slug],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${data.id}/branches`,
        method: "GET",
      }),
    enabled: data.id > 0,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};

export function useCreateBranch() {
  const queryClient = useQueryClient();
  const pathname = usePathname().split("/");
  const slug = pathname[2];
  return useMutation<BranchPublicDTO, Error, CreateBranchVars>({
    mutationFn: ({ shopId, payload }) =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/branches`,
        method: "POST",
        body: payload,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch", slug] });
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();
  const pathname = usePathname().split("/");
  const slug = pathname[2];
  return useMutation<BranchPublicDTO, Error, UpdateBranchVars>({
    mutationFn: ({ shopId, branchId, payload }) =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/branches/${branchId}`,
        method: "PUT",
        body: payload,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch", slug] });
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();
  const pathname = usePathname().split("/");
  const slug = pathname[2];
  return useMutation<BranchPublicDTO, Error, DeleteBranchVars>({
    mutationFn: ({ shopId, ids }) =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/branches`,
        method: "DELETE",
        body: { ids: ids },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch", slug] });
    },
  });
}
