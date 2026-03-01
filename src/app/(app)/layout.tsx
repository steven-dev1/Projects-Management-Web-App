'use client'
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { fetchUserAndProfile } from "@/store/slices/AuthSlice";
export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserAndProfile());
    }
  }, [dispatch, user, isLoading]);

  return (
    <>
        <main>{children}</main>
    </>
  )
}