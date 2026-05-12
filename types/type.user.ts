export type UserPublicDTO = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  lastSignInAt: Date | null;
  imageUrl: string;
  hasImage: boolean;
};

export type UserShopStatusDTO = {
  hasShop: boolean;
  shopCount: number;
  firstShopSlug: string;
};

export enum SHOP_CONTEXT_STATUS {
  NEED_BRANCH_SETUP = "NEED_BRANCH_SETUP",
  NOT_FOUND = "NOT_FOUND",
  OK = "OK",
}

export type ShopContextDTO =
  | {
      status: SHOP_CONTEXT_STATUS.OK;

      shop: {
        id: number;
        name: string;
        slug: string;
        branchCount: number;
      };
    }
  | {
      redirectTo: string;
      status:
        | SHOP_CONTEXT_STATUS.NOT_FOUND
        | SHOP_CONTEXT_STATUS.NEED_BRANCH_SETUP;
    };
