'use client'
import { fetchBoards } from "@/store/features/boards/BoardsThunks"
import { useAppDispatch } from "@/store/hooks"
import { useEffect } from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchBoards())
    }, [dispatch])

    return <>{children}</>
}