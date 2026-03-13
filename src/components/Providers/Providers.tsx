"use client";
import { ToastProvider } from "@heroui/react";
import DragDropProvider from "./DragDropProvider";
import { ReduxProvider } from "./ReduxProvider";
import AuthListener from "../UI/AuthListener";
import NotificationsListener from "../Notifications/NotificationsListener";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ToastProvider placement="bottom-right" />
      <AuthListener />
      <NotificationsListener />
      <DragDropProvider>
        {children}
      </DragDropProvider>
    </ReduxProvider>
  );
}