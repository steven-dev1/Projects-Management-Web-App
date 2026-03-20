"use client";
import ProjectsList from "@/components/Dashboard/ProjectsList";
import { useAppSelector } from "@/store/hooks";
import { Spinner } from "@heroui/react";
import { PackageOpen } from "lucide-react";

export default function ArchivedBoardsPage() {
  const { boards, status } = useAppSelector((state) => state.boards);
  const archivedBoards = boards.filter((b) => b.status === "archived");

  if (status === "loading" && archivedBoards.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <Spinner color="default" size="lg" />
      </div>
    );
  }

  if (archivedBoards.length === 0 && status === "succeeded") {
    return (
      <div className="text-sm md:text-base flex flex-col items-center justify-center gap-2 text-zinc-400 text-center py-8">
        <div className="dark:bg-zinc-900 bg-zinc-100 p-3 rounded-full">
            <PackageOpen size={48} />
        </div>
        <p>No hay tableros archivados</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold text-center md:text-left">Tableros archivados</h1>
        <ProjectsList boards={archivedBoards} />
    </div>
  );
}
