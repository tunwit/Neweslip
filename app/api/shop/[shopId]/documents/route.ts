import { employeeFilesTable, shopOwnerTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { count } from "console";
import { and, eq, like, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { shopFilesTable } from "@/db/schema/shopFilesTable";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shopId: string }> },
) {
  try {
    const shopId = (await params).shopId;

    if (!shopId) {
      return errorResponse("Bad request", 403);
    }
    const search = req.nextUrl.searchParams.get("search_query");
    const trimmedSearch = search?.trim();
    const searchFilter = trimmedSearch
      ? or(like(shopFilesTable.fileName, `%${trimmedSearch}%`))
      : undefined;

    const data = await globalDrizzle
      .select()
      .from(shopFilesTable)
      .where(
        and(
          eq(shopFilesTable.shopId, Number(shopId)),
          ...(searchFilter ? [searchFilter] : []),
        ),
      ).orderBy(shopFilesTable.uploadedAt);

    const client = await clerkClient();
    const uploaderIds = [
      ...new Set(data.map((f) => f.uploadedBy || "").filter(Boolean)),
    ];
    let uploaders: Record<string, any> = {};
    if (uploaderIds.length > 0) {
      const users = await client.users.getUserList({ userId: uploaderIds });
      uploaders = Object.fromEntries(
        users.data.map((u) => [
          u.id,
          {
            fullName: u.fullName,
            email: u.emailAddresses[0]?.emailAddress,
            imageUrl: u.imageUrl,
          },
        ]),
      );
    }

    const result = data.map((f) => ({
      ...f,
      uploadedByInfo: f.uploadedBy ? uploaders[f.uploadedBy] : null,
    }));

    return successResponse(result);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
