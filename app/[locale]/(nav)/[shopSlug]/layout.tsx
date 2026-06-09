import DashboardSidebar from "@/app/components/DashboardSidebar/DashboardSidebar";
import Navbar from "@/app/components/Navbar/Navbar";
import GlobalJobSnackbars from "@/widget/GlobalJobSnackbars";

export default async function ShoppLayout({
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
