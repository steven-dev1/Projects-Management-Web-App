"use client";
import { usePathname } from "next/navigation";
import MaxWidth from "../UI/MaxWidth";
import MainNavBar from "../NavBar/MainNavBar";

const hideOn = ["/signin", "/signup", "/forgot-password", "/reset-password"];

export function NavBarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldHide = hideOn.some((route) => pathname.startsWith(route));
  const isLanding = pathname === "/";
  const isBoard = pathname.startsWith("/boards");

  if (shouldHide || isLanding) return <>{children}</>;
  if (isBoard)
    return (
      <>
        <MainNavBar />
        {children}
      </>
    );

  return (
    <>
      <MainNavBar />
      <MaxWidth className="mt-8">{children}</MaxWidth>
    </>
  );
}
