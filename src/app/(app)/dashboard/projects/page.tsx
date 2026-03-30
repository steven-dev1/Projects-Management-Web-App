"use client";
import EmptyProjects from "@/components/Dashboard/EmptyProjects";
import Projects from "@/components/Dashboard/Projects";
import { SpinnerComponent } from "@/components/UI/Spinner";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function ProjectsPage() {
  const { activeBoards, status } = useDashboardStats();
  const activeBoardsLength = activeBoards.length;

  if (status === "loading" && activeBoardsLength === 0) {
    return (
      <SpinnerComponent />
    );
  }

  if (activeBoardsLength === 0 && status === "succeeded") {
    return <EmptyProjects />;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-center text-zinc-800 dark:text-zinc-100 mb-4">Mis proyectos</h1>
      <Projects boards={activeBoards} />
    </div>
  );
}
