"use client";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ToastProvider } from "@heroui/react";
import MaxWidth from "../UI/MaxWidth";

const hideOn = ["/signin", "/signup"];
const MainNavBar = dynamic(() => import('@/components/NavBar/MainNavBar'), { ssr: false })

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (hideOn.some((route) => pathname.startsWith(route))) {
    return <Provider store={store}>
      {children}
    </Provider>;
  }
  return (
    <Provider store={store}>
      <MainNavBar />
      <MaxWidth className="mt-8">
        <ToastProvider placement="bottom-right"/> 
        {children}
      </MaxWidth>
    </Provider>
  );
}
