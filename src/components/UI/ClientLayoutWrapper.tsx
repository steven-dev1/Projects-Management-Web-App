"use client"

import { usePathname } from "next/navigation"
import { ReduxProvider } from "../Providers/ReduxProvider"

const hideOn = ["/signin", "/signup"]

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (hideOn.some(route => pathname.startsWith(route))) {
    return null
  }

  return <ReduxProvider>{children}</ReduxProvider>
}