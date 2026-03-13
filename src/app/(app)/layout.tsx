'use client'
import { usePathname } from "next/navigation";
import DashboardSideNav from "@/components/Dashboard/DashboardSideNav";
export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");


  return (
    <div className={"flex gap-8 items-start justify-between"}>
      {isDashboard && <DashboardSideNav />}
        <main className="w-full">{children}</main>
    </div>
  )
}