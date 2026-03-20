'use client'
import EmptyProjects from "@/components/Dashboard/EmptyProjects";
import Projects from "@/components/Dashboard/Projects";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Spinner } from "@heroui/react";

export default function ProjectsPage() {
  const { activeBoards, status } = useDashboardStats();
  const activeBoardsLength = activeBoards.length;

  if (status === 'loading' && activeBoardsLength === 0) {
    return <div className='flex items-center justify-center'><Spinner color="default" size="lg" /></div>
  }

  if (activeBoardsLength === 0 && status === 'succeeded') {
    return <EmptyProjects />;
  }

  return <Projects boards={activeBoards} />
}