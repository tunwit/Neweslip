import { extractSlug } from "@/utils/extractSlug";
import { fetchwithauth } from "@/utils/fetcher";
import { auth } from "@clerk/nextjs/server";
import { useQuery } from "@tanstack/react-query";
import globalDrizzle from "../db/drizzle";
import { shopOwnerTable, shopsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import slugify from "slugify";

export const validateSlug = async (shopSlug: string) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    if (!shopSlug) {
      return null;
    }

    const { name, id } = extractSlug(shopSlug);
    if (!id) {
      return null;
    }

    const shop = await globalDrizzle
      .select({
        id: shopsTable.id,
        name: shopsTable.name,
        avatar: shopsTable.avatar,
      })
      .from(shopOwnerTable)
      .innerJoin(shopsTable, eq(shopOwnerTable.shopId, shopsTable.id))
      .where(
        and(eq(shopOwnerTable.ownerId, userId), eq(shopOwnerTable.shopId, id)),
      );

    if (shop.length === 0) {
      return null;
    }

    const expectedSlug = slugify(`${shop[0].name}-${shop[0].id}`);
    if (shopSlug !== expectedSlug) {
      return null;
    }

    return shop[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};
