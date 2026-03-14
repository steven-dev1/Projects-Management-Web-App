'use client'
import EmptyProjects from "@/components/Dashboard/EmptyProjects";
import ProjectsList from "@/components/Dashboard/Projects";
import { useAppSelector } from "@/store/hooks";
import { Spinner } from "@heroui/react";

export default function ProjectsPage() {
    const { boards, status } = useAppSelector((state) => state.boards);

  if (status === 'loading' && boards.length === 0) {
    return <div className='flex items-center justify-center'><Spinner color="default" size="lg" /></div>
  }

  if (boards.length === 0 && status === 'succeeded') {
    return <EmptyProjects />;
  }

  return <ProjectsList boards={boards} />
}