"use client";
import BoardHeader from "@/components/Board/BoardHeader";
import SkeletonBoardHeader from "@/components/Board/SkeletonBoardHeader";
import BoardNavBar from "@/components/NavBar/BoardNavBar";
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
    dispatch(fetchBoardById(id));
  }, [dispatch, id]);

  if (!currentBoard) return <SkeletonBoardHeader />;
  return (
    <div className="flex flex-col" style={{ height: '100dvh' }}>
      <BoardNavBar />
      <BoardHeader board={currentBoard} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
