"use client";
import { syncCurrentBoard } from "@/store/features/boards/BoardsSlice";
// import { clearCurrentBoard } from "@/store/features/boards/BoardsSlice";
import { fetchBoards } from "@/store/features/boards/BoardsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { boards, status } = useAppSelector((state) => state.boards);
  const currentBoard = useAppSelector((state) => state.boards.currentBoard);

  useEffect(() => {
    if (currentBoard) {
      dispatch(syncCurrentBoard());
    }

    if (status === "idle" || boards.length === 0) {
      dispatch(fetchBoards());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
