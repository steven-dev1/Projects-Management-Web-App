'use client';
import BoardHeader from "@/components/Board/BoardHeader";
import SkeletonBoardHeader from "@/components/Board/SkeletonBoardHeader";
import { fetchBoardById } from "@/store/features/boards/BoardsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>()
  const {currentBoard} = useAppSelector((state) => state.boards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id) return;
    dispatch(fetchBoardById(id));
  }, [dispatch, id]);
  
  
  if (!currentBoard) return <SkeletonBoardHeader />;
  return (
    <>
      <BoardHeader board={currentBoard}/>
      {children}
    </>
  );
}
