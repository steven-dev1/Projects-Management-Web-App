import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./features/auth/AuthSlice"
import boardsReducer from "./features/boards/BoardsSlice"
import notificationsReducer from "./features/notifications/notificationsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardsReducer,
    notifications: notificationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch