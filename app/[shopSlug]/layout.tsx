import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SnackBar from "../../widget/SnackBar";
import { validateSlug } from "@/lib/validateSlug";
import getBranches from "@/lib/getBranches";
import { Branch } from "@/types/branch";
import DashboardSidebar from "../components/DashboardSidebar/DashboardSidebar";

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
  
  if (!data) {
    redirect("/");
  }
  let branches: Branch[]  

  return <div className="flex w-screen">
     <DashboardSidebar />
    {children}
    </div>;
}
