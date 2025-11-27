"use server";
import { employeesTable, invitationsTable} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee, NewEmployee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { INVITATION_STATUS } from "@/types/enum/enum";

export async function acceptInvitation(
 token:string
) {
  try {
    await globalDrizzle
      .update(invitationsTable)
      .set({
        status:INVITATION_STATUS.ACCEPTED,
        acceptedAt: new Date()
      })
      .where(eq(invitationsTable.token, token))
  } catch (err) {
    throw err;
  }
}
