import { createClient } from "@/lib/supabaseClient";
import { AppNotification } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

const supabase = createClient();

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return rejectWithValue(error.message);
    return data as AppNotification[];
  }
);

export const markAsRead = createAsyncThunk<string, string>(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) return rejectWithValue(error.message);
    return notificationId;
  }
);

export const markAllAsRead = createAsyncThunk<void, void>(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) return rejectWithValue(error.message);
  }
);