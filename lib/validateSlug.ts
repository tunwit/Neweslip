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
    const { userId, getToken } = await auth();

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
    const token = await getToken();
    const res = await fetch(`http://localhost:3001/shops/resolve/${shopSlug}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const json = await res.json();
    const shop = json.data;
    if (json.success === false) return false;

    return shop;
  } catch (err) {
    console.error(err);
    return null;
  }
};
