"use server";
import { employeesTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee, NewEmployee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { NewShop } from "@/types/shop";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function changeShopPassword(
  oldpassword: string,
  newpassword: string,
  shopId: number,
  userId: string | null,
) {
  const ownerCheck = await isOwner(shopId, userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    const [shop] = await globalDrizzle
      .select({
        password: shopsTable.password,
      })
      .from(shopsTable)
      .where(eq(shopsTable.id, shopId))
      .limit(1);
    if (!shop.password) return { code: 404, message: "password not set" };

    if (!(await verifyPassword(oldpassword, shop.password)))
      return { code: 401, message: "wrong password" };

    const newHashed = await hashPassword(newpassword);
    await globalDrizzle
      .update(shopsTable)
      .set({ password: newHashed })
      .where(eq(shopsTable.id, shopId));
    return {
      code: 200,
      message: "success",
    };
  } catch (err) {
    throw err;
  }
}
