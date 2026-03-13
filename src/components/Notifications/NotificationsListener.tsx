"use client";
import { createClient } from "@/lib/supabaseClient";
import { addNotification } from "@/store/features/notifications/notificationsSlice";
import { fetchNotifications } from "@/store/features/notifications/notificationsThunks";
import { AppDispatch, RootState } from "@/store/store";
import { AppNotification } from "@/types";
import { addToast } from "@heroui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function NotificationsListener() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    dispatch(fetchNotifications());

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Notificación recibida:", payload);
          const notification = payload.new as AppNotification;
          dispatch(addNotification(notification));
          addToast({
            title: notification.title,
            description: notification.message,
            color: "primary",
          });
        },
      )
      .subscribe((status) => {
        console.log("Estado del canal:", status); // <- y esto
      });

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dispatch]);

  return null;
}
