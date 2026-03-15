"use client";
// import { clearCurrentBoard } from "@/store/features/boards/BoardsSlice";
import { fetchBoards } from "@/store/features/boards/BoardsThunks";
import { useAppDispatch } from "@/store/hooks";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  useEffect(() => {
      dispatch(fetchBoards());
  }, [dispatch, pathname]);

  return <>{children}</>;
}
