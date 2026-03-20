'use client'
import { Divider } from "@heroui/react";
import { Folders, Home, PanelsLeftBottom } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardSideNav() {
  const pathname = usePathname();
  const LinkStyles = "p-2 dark:hover:bg-zinc-900 rounded-lg hover:bg-zinc-200 flex items-center gap-2";
  return (
    <div className="hidden md:flex flex-col items-center w-96 justify-center">
      <ul className="w-full flex flex-col gap-2 text-sm md:text-base">
        <li>
          <Link className={`${pathname === "/dashboard" && "bg-zinc-300 dark:bg-zinc-900"} ${LinkStyles}`} href={"/dashboard"}>
            <Home size={18} />
            Inicio
          </Link>
        </li>
        <li>
          <Link className={`${pathname === "/dashboard/projects" && "bg-zinc-300 dark:bg-zinc-900"} ${LinkStyles}`} href={"/dashboard/projects"}>
            <Folders size={18} />
            Tableros
          </Link>
        </li>
        <li>
          <Link className={`${pathname === "/dashboard/templates" && "bg-zinc-300 dark:bg-zinc-900"} ${LinkStyles}`} href={"/dashboard/templates"}>
            <PanelsLeftBottom size={18} />
            Plantillas
          </Link>
        </li>
        <Divider className="my-2" />
      </ul>
    </div>
  );
}
