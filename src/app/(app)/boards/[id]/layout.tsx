"use client";
import BoardHeader from "@/components/Board/BoardHeader";
import SkeletonBoardHeader from "@/components/Board/SkeletonBoardHeader";
import { ErrorBoundary } from "@/components/UI/ErrorBoundary";
import { fetchBoardById } from "@/store/features/boards/BoardsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const { currentBoard } = useAppSelector((state) => state.boards);
  const isLoadingBoard = currentBoard?.id !== id;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id) return;

    dispatch(fetchBoardById(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <ErrorBoundary>
      <div className="flex flex-col" style={{ height: "calc(100dvh - 65px)" }}>
        {isLoadingBoard ? (
          <SkeletonBoardHeader />
        ) : (
          <>
            <BoardHeader />
            <div className="flex-1 overflow-hidden">{children}</div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
