import { createSlice } from "@reduxjs/toolkit";
import { fetchNotifications, markAllAsRead, markAsRead } from "./notificationsThunks";
import { AppNotification } from "@/types";
import { logout } from "@/store/features/auth/AuthSlice";

interface NotificationsState {
  items: AppNotification[];
  isLoading: boolean;
}

const initialState: NotificationsState = {
  items: [],
  isLoading: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const n = state.items.find((n) => n.id === action.payload);
        if (n) n.is_read = true;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items.forEach((n) => (n.is_read = true));
      })
      .addCase(logout, () => initialState)
  },
});

export const { addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;