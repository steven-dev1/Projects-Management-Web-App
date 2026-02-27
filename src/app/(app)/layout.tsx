import MainNavBar from "@/components/NavBar/MainNavBar"
import ClientLayoutWrapper from "@/components/UI/ClientLayoutWrapper"


export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ClientLayoutWrapper>
        <MainNavBar />
      </ClientLayoutWrapper>
      <main>{children}</main>
    </>
  )
}