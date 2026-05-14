import { ApiResponse } from "@/types/response";
import { ShopContextDTO, UserShopStatusDTO } from "@/types/type.user";
import { fetchwithauth } from "@/utils/fetcher";
import { cookies } from "next/headers";

export const getShopStatus = async () => {
  const cookieStore = await cookies();
  const data: ApiResponse<UserShopStatusDTO> = await fetchwithauth({
    endpoint: "/user/me/shop-status",
    method: "GET",
    cookie: cookieStore,
  });

  return data.data;
};

export const getShopContext = async (shopSlug: string) => {
  const cookieStore = await cookies();
  const data: ApiResponse<ShopContextDTO> = await fetchwithauth({
    endpoint: `/shops/context/${shopSlug}`,
    method: "GET",
    cookie: cookieStore,
  });

  return data.data;
};
