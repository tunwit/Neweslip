import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SnackBar from "../components/UI/SnackBar";

export default async function ShoppLayout({
  params,
  children,
}: {
  params: Promise<{ shopSlug: string }>;
  children: React.ReactNode;
}) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const session_token = cookieStore.get("next-auth.session-token")?.value;
  const { shopSlug } = resolvedParams;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (session_token) {
    headers["cookie"] = `next-auth.session-token=${session_token}`;
  }

  const res = await fetch(
    `http://localhost:3001/v1/shop/validateSlug?shopSlug=${shopSlug}`,
    {
      method: "GET",
      credentials: "include",
      headers,
    },
  );

  if (res.status !== 202) {
    redirect("/");
  }

  return <div className="flex w-screen">{children}</div>;
}
