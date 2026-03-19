"use client";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@heroui/react";
import { ReduxProvider } from "./ReduxProvider";
import AuthListener from "../UI/AuthListener";
import NotificationsListener from "../Notifications/NotificationsListener";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ReduxProvider>
        <ToastProvider placement="bottom-right" />
        <AuthListener />
        <NotificationsListener />
        {children}
      </ReduxProvider>
    </ThemeProvider>
  );
}
