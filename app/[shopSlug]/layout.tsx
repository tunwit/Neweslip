import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SnackBar from "../../widget/SnackBar";
import { validateSlug } from "@/lib/validateSlug";
import getBranches from "@/lib/getBranches";
import { Branch } from "@/types/branch";
import DashboardSidebar from "../components/DashboardSidebar/DashboardSidebar";
import { auth } from "@clerk/nextjs/server";
import globalDrizzle from "@/db/drizzle";
import { branchesTable, shopOwnerTable, shopsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

async function fetchData(token: string, origin: string, path:string) {
  const res = await fetch(`${origin}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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
  params: Promise<{ shopSlug: string }>;
  children: React.ReactNode;
}) {
  const resolvedParams = await params;
  const { shopSlug } = resolvedParams;

  const data = await validateSlug(shopSlug);
  const { userId, redirectToSignIn, getToken } = await auth();
  const token = await getToken()

  if (!token || !userId) {
    redirect("/");
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
      redirect(`/no-shop`);
    }

    if(!data){
      redirect("/")
    }
    
    const branches:Branch[] = await globalDrizzle
      .select({
        id: branchesTable.id,
        name: branchesTable.name,
        nameEng: branchesTable.nameEng,
        shopId: branchesTable.shopId,
      })
      .from(branchesTable)
      .innerJoin(
        shopOwnerTable,
        eq(branchesTable.shopId, shopOwnerTable.shopId),
      )
      .where(
        and(
          eq(branchesTable.shopId, Number(data.id)),
          eq(shopOwnerTable.ownerId, userId),
        ),
      );

    // Redirect to setup if no branches exist
    if (!branches || branches.length === 0) {
      redirect(`/setup-branch?shopId=${data.id}`);
    }


  return <div className="flex w-screen">
     <DashboardSidebar />
    {children}
    </div>;
}
