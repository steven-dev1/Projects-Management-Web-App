import { AppNotification } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { notificationsService } from "@/services/notificationsService";

export const fetchNotifications = createAsyncThunk("notifications/fetchAll", async (_, { rejectWithValue }) => {
  const { data, error } = await notificationsService.fetchAll();
  if (error) return rejectWithValue(error.message);
  return data as AppNotification[];
});

export const markAsRead = createAsyncThunk<string, string>(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    const { error } = await notificationsService.markAsRead(notificationId);
    if (error) return rejectWithValue(error.message);
    return notificationId;
  }
);

export const markAllAsRead = createAsyncThunk<void, void>(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    const { error } = await notificationsService.markAllAsRead();
    if (error) return rejectWithValue(error.message);
  }
);