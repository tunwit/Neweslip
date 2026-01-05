import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { connection } from "@/src/infra/bullmq/connection";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const batchId = request.nextUrl.searchParams.get("batchId");
    const batchName = request.nextUrl.searchParams.get("batchName");

    const total = Number(
      await connection.get(`flow:${batchName}:${batchId}:total`),
    );

    const completed = Number(
      (await connection.get(`flow:${batchName}:${batchId}:completed`)) || 0,
    );
    const failed = Number(
      (await connection.get(`flow:${batchName}:${batchId}:failed`)) || 0,
    );
    return successResponse({
      total,
      completed,
      failed,
      pending: total - completed - failed,
      percent: Math.round((completed / total) * 100),
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}
