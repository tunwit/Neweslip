import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSlug } from "@/lib/validateSlug";
import getBranches from "@/lib/getBranches";
import { Branch } from "@/types/branch";
import { auth } from "@clerk/nextjs/server";
import globalDrizzle from "@/db/drizzle";
import { branchesTable, shopOwnerTable, shopsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import DashboardSidebar from "@/app/components/DashboardSidebar/DashboardSidebar";
import Navbar from "@/app/components/Navbar/Navbar";
import GlobalJobSnackbars from "@/widget/GlobalJobSnackbars";

async function fetchData(token: string, origin: string, path: string) {
  const res = await fetch(`${origin}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`API returned ${res.status}`);
  }

  const json = await res.json();
  return json.data;
}

export default async function ShoppLayout({
  params,
  children,
}: {
  params: Promise<{ shopSlug: string; locale: string }>;
  children: React.ReactNode;
}) {
  const resolvedParams = await params;
  const { shopSlug, locale } = resolvedParams;

  const data = await validateSlug(shopSlug);
  const { userId, redirectToSignIn, getToken } = await auth();
  const token = await getToken();

  if (!token || !userId) {
    redirect(`/${locale}`);
  }

  const shops = await globalDrizzle
    .select({
      id: shopsTable.id,
      name: shopsTable.name,
      avatar: shopsTable.avatar,
    })
    .from(shopOwnerTable)
    .innerJoin(shopsTable, eq(shopOwnerTable.shopId, shopsTable.id))
    .where(eq(shopOwnerTable.ownerId, userId));

  // Redirect to setup if no branches exist
  if (!shops || shops.length === 0) {
    redirect(`${locale}/no-shop`);
  }

  if (!data) {
    redirect(`/${locale}`);
  }

  const branches: Branch[] = await globalDrizzle
    .select({
      id: branchesTable.id,
      name: branchesTable.name,
      nameEng: branchesTable.nameEng,
      shopId: branchesTable.shopId,
      address: branchesTable.address,
    })
    .from(branchesTable)
    .innerJoin(shopOwnerTable, eq(branchesTable.shopId, shopOwnerTable.shopId))
    .where(
      and(
        eq(branchesTable.shopId, Number(data.id)),
        eq(shopOwnerTable.ownerId, userId),
      ),
    );

  // Redirect to setup if no branches exist
  if (!branches || branches.length === 0) {
    redirect(`/${locale}/setup-branch?shopId=${data.id}`);
  }

  return (
    <div className="flex w-screen bg-yellow-300">
      <div className="flex flex-col min-h-screen w-full bg-red-500 ">
        <Navbar />
        <div className="flex flex-row w-full max-h-[calc(100vh-80px)] h-screen overflow-hidden">
          <DashboardSidebar />
          <GlobalJobSnackbars />
          {children}
        </div>
      </div>
    </div>
  );
}
