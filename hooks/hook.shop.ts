import { ApiResponse } from "@/types/response";
import { Shop } from "@/types/shop";
import { fetchwithauth } from "@/utils/fetcher";
import { useSession } from "@clerk/nextjs";
import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Session } from "inspector/promises";
import { useCurrentShop } from "./shop/useCurrentShop";

export const useOwnShop = () => {
  const { session, isLoaded, isSignedIn } = useSession();
  const query = useQuery<ApiResponse<Shop[]>>({
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
  const query = useQuery<ApiResponse<Shop>>({
    queryKey: ["shop", "data"],
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
  const query = useQuery<ApiResponse<Shop>>({
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
