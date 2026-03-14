"use client";
import BoardHeader from "@/components/Board/BoardHeader";
import SkeletonBoardHeader from "@/components/Board/SkeletonBoardHeader";
import { clearCurrentBoard } from "@/store/features/boards/BoardsSlice";
import { fetchBoardById } from "@/store/features/boards/BoardsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const BoardNavBar = dynamic(() => import("@/components/Board/BoardNavBar"), { ssr: false });
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
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      <BoardNavBar />
      {!currentBoard ? (
        <SkeletonBoardHeader />
      ) : (
        <>
          <BoardHeader board={currentBoard} />
          <main className="flex-1 overflow-hidden">{children}</main>
        </>
      )}
    </div>
  );
}
