"use client";
import { ErrorBoundary } from "@/components/UI/ErrorBoundary";
import { fetchBoards } from "@/store/features/boards/BoardsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { boards, status } = useAppSelector((state) => state.boards);

  useEffect(() => {
    if (status === "idle" || (status === "succeeded" && boards.length === 0)) {
      dispatch(fetchBoards());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ErrorBoundary>{children}</ErrorBoundary>;
}
