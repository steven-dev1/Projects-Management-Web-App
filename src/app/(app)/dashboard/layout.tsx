"use client";
import { fetchBoards } from "@/store/features/boards/BoardsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { boards, status } = useAppSelector((state) => state.boards);
  useEffect(() => {
    if (boards.length === 0 || status === "idle") {
      dispatch(fetchBoards());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return <>{children}</>;
}
