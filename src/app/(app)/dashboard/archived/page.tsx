"use client";
import ButtonCreateProject from "@/components/Dashboard/ButtonCreateProject";
import ProjectsList from "@/components/Dashboard/ProjectsList";
import { useAppSelector } from "@/store/hooks";
import { Spinner } from "@heroui/react";
import { ArrowLeft, PackageOpen } from "lucide-react";
import Link from "next/link";

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
        <h1 className="text-xl font-bold text-center">Tableros archivados</h1>
        <div className="flex gap-2 items-center justify-center">
          <ButtonCreateProject />
          <Link href="/dashboard/projects" className="dark:bg-zinc-900 bg-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm p-3 rounded-xl flex items-center text-zinc-300 gap-2">
          <ArrowLeft size={16} />
            Volver a mis tableros
          </Link>
        </div>
        <ProjectsList boards={archivedBoards} />
    </div>
  );
}
