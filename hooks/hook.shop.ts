import { ApiResponse } from "@/types/response";
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Session } from "inspector/promises";
import { useCurrentShop } from "./shop/useCurrentShop";
import {
  ChangePasswordDTO,
  ShopConfigDTO,
  ShopPublicDTO,
  UpdateShopDataDTO,
  VerifyEmailDTO,
} from "@/types/type.shop";

type UpdateShopDataVars = {
  shopId: number;
  payload: UpdateShopDataDTO;
};

type UpdateShopPasswordVars = {
  shopId: number;
  payload: ChangePasswordDTO;
};

export const useOwnShop = () => {
  const { session, isLoaded, isSignedIn } = useSession();
  const query = useQuery<ApiResponse<ShopPublicDTO[]>>({
    queryKey: ["shop", session?.user?.emailAddresses],
    queryFn: () =>
      fetchwithauth({
        endpoint: "/shops",
        method: "GET",
      }),
    enabled: isLoaded && isSignedIn,
    refetchOnWindowFocus: true,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};

export const useShopData = () => {
  const { id: shopId } = useCurrentShop();
  const query = useQuery<ApiResponse<ShopPublicDTO>>({
    queryKey: ["shop", "data", shopId],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}`,
        method: "GET",
      }),
    refetchOnWindowFocus: true,
    enabled: shopId !== null && shopId !== undefined,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};

export const useShopConfigs = () => {
  const { id: shopId } = useCurrentShop();
  const query = useQuery<ApiResponse<ShopConfigDTO>>({
    queryKey: ["shop", "config"],
    queryFn: () =>
      fetchwithauth({
        endpoint: `/shops/${shopId}?configs=true`,
        method: "GET",
      }),
    refetchOnWindowFocus: true,
    enabled: shopId !== null && shopId !== undefined,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  return query;
};

export function useUpdateShop() {
  const { id: shopId } = useCurrentShop();
  const queryClient = useQueryClient();

  return useMutation<ShopPublicDTO, Error, UpdateShopDataVars>({
    mutationFn: ({ shopId, payload }) =>
      fetchwithauth({
        endpoint: `/shops/${shopId}`,
        method: "PATCH",
        body: payload,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop", "data", shopId] });
    },
  });
}

export function useVerifyEmailConfig() {
  const { id: shopId } = useCurrentShop();
  return useMutation({
    mutationFn: (payload: VerifyEmailDTO) =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/email/verify`,
        method: "POST",
        body: payload,
      }),
  });
}

export function useChangeShopPassword() {
  const { id: shopId } = useCurrentShop();
  return useMutation({
    mutationFn: (payload: ChangePasswordDTO) =>
      fetchwithauth({
        endpoint: `/shops/${shopId}/change-password`,
        method: "POST",
        body: payload,
      }),
  });
}
