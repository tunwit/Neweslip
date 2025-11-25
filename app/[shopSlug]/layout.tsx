import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SnackBar from "../../widget/SnackBar";
import { validateSlug } from "@/lib/validateSlug";
import getBranches from "@/lib/getBranches";
import { Branch } from "@/types/branch";
import DashboardSidebar from "../components/DashboardSidebar/DashboardSidebar";
import { auth } from "@clerk/nextjs/server";

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

  if (!data || !token) {
    redirect("/");
  }
  
  try {
    const shops = await fetchData(token, window.location.origin, `/api/shop?shopId=${userId}`);
     // Redirect to setup if no branches exist
    if (!shops.data?.data || shops.data?.data.length === 0) {
      redirect(`/no-shop`);
    }
    
    const branches = await fetchData(token, window.location.origin, `/api/shop/branch?shopId=${data.id}`);

    // Redirect to setup if no branches exist
    if (!branches || branches.length === 0) {
      redirect(`/setup-branch?shopId=${data.id}`);
    }
  } catch (err) {
     redirect(`/error`)
  }


  return <div className="flex w-screen">
     <DashboardSidebar />
    {children}
    </div>;
}
