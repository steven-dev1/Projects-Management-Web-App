'use client'
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { fetchUserAndProfile } from "@/store/slices/AuthSlice";
import { usePathname } from "next/navigation";
import DashboardSideNav from "@/components/Dashboard/DashboardSideNav";
export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserAndProfile());
    }
  }, [dispatch, user, isLoading]);

  return (
    <div className={"flex gap-8 items-start justify-between"}>
      {isDashboard && <DashboardSideNav />}
        <main className="w-full">{children}</main>
    </div>
  )
}