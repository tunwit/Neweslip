import { redirect } from "next/navigation";
import { validateSlug } from "@/lib/validateSlug";
import { auth } from "@clerk/nextjs/server";
import DashboardSidebar from "@/app/components/DashboardSidebar/DashboardSidebar";
import Navbar from "@/app/components/Navbar/Navbar";
import GlobalJobSnackbars from "@/widget/GlobalJobSnackbars";
import { extractSlug } from "@/utils/extractSlug";

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
  return (
    <div className="flex w-screen ">
      <div className="flex flex-col min-h-screen w-full ">
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
