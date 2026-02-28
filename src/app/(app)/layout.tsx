'use client'
import ClientLayoutWrapper from "@/components/UI/ClientLayoutWrapper"
import dynamic from 'next/dynamic'

const MainNavBar = dynamic(() => import('@/components/NavBar/MainNavBar'), { ssr: false })

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ClientLayoutWrapper>
        <MainNavBar />
        <main>{children}</main>
      </ClientLayoutWrapper>
    </>
  )
}