import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SnackBar from "../components/UI/SnackBar";
import { validateSlug } from "@/lib/validateSlug";

export default async function ShoppLayout({
  params,
  children,
}: {
  params: Promise<{ shopSlug: string }>;
  children: React.ReactNode;
}) {
  const resolvedParams = await params;
  const { shopSlug } = resolvedParams;

  const data = await validateSlug(shopSlug)
  
  if (!data) {
    redirect("/");
  }

  return <div className="flex w-screen">{children}</div>;
}
