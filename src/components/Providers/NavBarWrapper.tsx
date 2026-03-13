"use client";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import MaxWidth from "../UI/MaxWidth";

const hideOn = ["/signin", "/signup", "/boards",];
const MainNavBar = dynamic(() => import('@/components/NavBar/MainNavBar'), { ssr: false });

export function NavBarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldHide = hideOn.some((route) => pathname.startsWith(route));
  const isLanding = pathname === "/";

  if (shouldHide || isLanding) return <>{children}</>;

  return (
    <>
      <MainNavBar />
      <MaxWidth className="mt-8">
        {children}
      </MaxWidth>
    </>
  );
}