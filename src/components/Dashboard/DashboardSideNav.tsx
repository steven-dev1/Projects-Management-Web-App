import { Divider } from "@heroui/react";
import { Folders, Home, PanelsLeftBottom } from "lucide-react";
import Link from "next/link";

export default function DashboardSideNav() {
    const LinkStyles = "p-2 rounded-lg hover:bg-zinc-200 flex items-center gap-2";
  return (
    <div className="hidden sm:flex flex-col items-center w-96 justify-center">
      <ul className="w-full flex flex-col gap-2">
        <li>
          <Link
            className={LinkStyles}
            href={"/dashboard"}
          >
            <Home size={18} />
            Inicio
          </Link>
        </li>
        <li>
          <Link
            className={LinkStyles}
            href={"/dashboard/projects"}
          >
            <Folders size={18} />
            Proyectos
          </Link>
        </li>
        <li>
          <Link
            className={LinkStyles}
            href={"/dashboard/templates"}
          >
            <PanelsLeftBottom size={18} />
            Plantillas
          </Link>
        </li>
      </ul>
      <Divider className="my-4" />
    </div>
  );
}
