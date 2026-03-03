'use client'
import EmptyProjects from '@/components/Dashboard/EmptyProjects';
import ProjectsList from '@/components/Dashboard/ProjectsList';
import { useAppSelector } from '@/store/hooks';
import { Spinner } from '@heroui/react';
import React from 'react'

export default function DashboardPage() {
  const { boards, status } = useAppSelector((state) => state.boards);
  if(status === 'loading' || status === 'idle') {
    return <div className='flex items-center justify-center'><Spinner color="default" size="lg" /></div>
  }
  if (boards.length === 0 && status === 'succeeded') {
    return <EmptyProjects />;
  }
  return (
    <ProjectsList boards={boards} />
  )
}
