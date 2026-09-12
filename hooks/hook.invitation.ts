import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentShop } from "./shop/useCurrentShop";
import { ApiResponse } from "@/types/response";
import { fetchwithauth } from "@/utils/fetcher";
import {
  CreateInvitation,
  CreateTokenRepounseDTO,
  InvitationPublicDTO,
} from "@/types/type.invitation";

export function useInvitation() {
  const { id: shopId } = useCurrentShop();
  const queryClient = useQueryClient();

  const queryKey = ["invitation", shopId];

  const create = useMutation<
    ApiResponse<CreateTokenRepounseDTO>,
    Error,
    { payload: CreateInvitation }
  >({
    mutationFn: ({ payload }) => {
      return fetchwithauth({
        endpoint: `/shops/${shopId}/invitations`,
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

  const useGetByToken = (token: string | null) => {
    return useQuery<ApiResponse<InvitationPublicDTO>>({
      queryKey: [...queryKey, token],
      queryFn: () =>
        fetchwithauth({
          endpoint: `/invitations/token/${token}`,
          method: "GET",
        }),
      enabled: token != null,
    });
  };

  const useAccept = (token: string | null) =>
    useMutation<ApiResponse<boolean>, Error>({
      mutationFn: () => {
        return fetchwithauth({
          endpoint: `/invitations/token/${token}/accept`,
          method: "POST",
        });
      },
      onSuccess: (data) => {
        console.log("created:", data);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
      },
    });
  return { create, useGetByToken, useAccept };
}
