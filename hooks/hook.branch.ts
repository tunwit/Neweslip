import { BranchPublicDTO, NewBranchDTO } from "@/types/type.branch";
import { ApiResponse } from "@/types/response";
import { fetchwithauth } from "@/utils/fetcher";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useCurrentShop } from "./shop/useCurrentShop";

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
  const { id: shopId } = useCurrentShop();

  const query = useQuery<ApiResponse<BranchPublicDTO[]>>({
    queryKey: ["branch", shopId],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/branches`,
        method: "GET",
      }),
    enabled: shopId != null,
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
  const { id: shopId } = useCurrentShop();
  return useMutation<BranchPublicDTO, Error, DeleteBranchVars>({
    mutationFn: ({ shopId, ids }) =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/branches`,
        method: "DELETE",
        body: { ids: ids },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch", shopId] });
    },
  });
}
