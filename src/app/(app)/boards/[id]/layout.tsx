"use client";
import BoardHeader from "@/components/Board/BoardHeader";
import SkeletonBoardHeader from "@/components/Board/SkeletonBoardHeader";
import { clearCurrentBoard } from "@/store/features/boards/BoardsSlice";
import { fetchBoardById } from "@/store/features/boards/BoardsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";


export default function BoardLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const { currentBoard } = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id) return;
    dispatch(clearCurrentBoard());
    dispatch(fetchBoardById(id));

    return () => {
      dispatch(clearCurrentBoard());
    };
  }, [dispatch, id]);

  return (
    <div className="flex flex-col" style={{ height: "calc(100dvh - 65px)" }}>
      {!currentBoard ? (
        <SkeletonBoardHeader />
      ) : (
        <>
          <BoardHeader />
          <main className="flex-1 overflow-hidden">{children}</main>
        </>
      )}
    </div>
  );
}
