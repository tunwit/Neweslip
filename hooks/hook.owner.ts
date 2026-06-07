import { Owner } from "@/types/owner";
import { ApiResponse } from "@/types/response";
import { fetchwithauth } from "@/utils/fetcher";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCurrentShop } from "./shop/useCurrentShop";

export const useOwners = () => {
  const { id: shopId } = useCurrentShop();
  const query = useQuery<ApiResponse<Owner[]>>({
    queryKey: ["owners", shopId],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/owners`,
        method: "GET",
      }),
    enabled: shopId != null,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};

type DeleteOwnersVars = {
  toDeleteUserIds: string[];
};
export function useDeleteOwners() {
  const queryClient = useQueryClient();
  const { id: shopId } = useCurrentShop();
  return useMutation<boolean, Error, DeleteOwnersVars>({
    mutationFn: ({ toDeleteUserIds }) =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/owners`,
        method: "DELETE",
        body: { toDeleteUserIds },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owners", shopId] });
    },
  });
}
