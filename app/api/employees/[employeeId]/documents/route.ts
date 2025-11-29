import { employeeFilesTable, shopOwnerTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { count } from "console";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

export async function GET(req:NextRequest,{ params }: { params: Promise<{ employeeId: string }> }) {
  try {
    const employeeId = (await params).employeeId

    if (!employeeId) {
      return errorResponse("Bad request", 403);
    }

    const data = await globalDrizzle
      .select()
      .from(employeeFilesTable)
      .where(
        eq(employeeFilesTable.employeeId, Number(employeeId))
      )
    
    const client = await clerkClient()
    const uploaderIds = [...new Set(data.map(f => f.uploadedBy).filter(Boolean))];
    let uploaders: Record<string, any> = {};
    if (uploaderIds.length > 0) {
      const users = await client.users.getUserList({ userId: uploaderIds  });
      uploaders = Object.fromEntries(users.data.map(u => [u.id, { fullName: u.fullName, email: u.emailAddresses[0]?.emailAddress,imageUrl:u.imageUrl }]));
    }

    const result = data.map(f => ({
      ...f,
      uploadedByInfo: f.uploadedBy ? uploaders[f.uploadedBy] : null
    }));

    return successResponse(result);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
