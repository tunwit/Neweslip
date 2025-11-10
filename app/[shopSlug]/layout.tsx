import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SnackBar from "../../widget/SnackBar";
import { validateSlug } from "@/lib/validateSlug";
import getBranches from "@/lib/getBranches";
import { Branch } from "@/types/branch";

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
  
    branches = await getBranches(data?.id)


  if(branches.length === 0){
    redirect(`/${shopSlug}/settings`);
  }

  return <div className="flex w-screen">{children}</div>;
}
