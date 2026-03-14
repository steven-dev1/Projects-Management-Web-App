"use client";
import { createClient } from "@/lib/supabaseClient";
import { logout } from "@/store/features/auth/AuthSlice";
import { fetchUserAndProfile } from "@/store/features/auth/AuthThunks";
import { clearCurrentBoard } from "@/store/features/boards/BoardsSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect, useRef } from "react";

export default function AuthListener() {
  const dispatch = useAppDispatch();
  const supabase = createClient();
  const currentUserId = useRef<string | null>(null);

  useEffect(() => {
    dispatch(fetchUserAndProfile()).then((action) => {
      if (fetchUserAndProfile.fulfilled.match(action)) {
        currentUserId.current = action.payload.user?.id ?? null;
      }
    });
  }, [dispatch]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        currentUserId.current = null;
        dispatch(logout());
        dispatch(clearCurrentBoard());
        return;
      }

      if (event === "SIGNED_IN" && session?.user) {
        if (session.user.id !== currentUserId.current) {
          currentUserId.current = session.user.id;
          dispatch(fetchUserAndProfile());
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, supabase]);

  return null;
}
