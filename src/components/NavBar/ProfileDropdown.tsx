import { signOutAction } from "@/lib/SignOutAction";
import { useAppSelector } from "@/store/hooks";
import { Avatar } from "@heroui/avatar";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Skeleton } from "@heroui/react";
import { ArrowRightFromLine, FolderOpenDot, Settings } from "lucide-react";
import Link from "next/link";

export default function ProfileDropdown() {
  const { profile, isLoading } = useAppSelector((state) => state.auth);
  return (
    <Dropdown className="items-center gap-2 hidden sm:flex">
      <DropdownTrigger className="cursor-pointer hidden sm:flex">
        {isLoading ? (
          <Skeleton className="w-10 h-10 rounded-full" />
        ) : (
          <Avatar
            isBordered
            radius="full"
            color="default"
            name={profile?.full_name}
            src={profile?.avatar_url ?? undefined}
            size="md"
          />
        )}
      </DropdownTrigger>
      <DropdownMenu variant="flat">
        <DropdownItem key="projects">
          <Link href="/dashboard/projects" className="flex items-center gap-2">
            <FolderOpenDot size={18} /> Mis proyectos
          </Link>
        </DropdownItem>
        <DropdownItem key="settings">
          <Link href="/settings" className="flex items-center gap-2">
            <Settings size={18} /> Ajustes
          </Link>
        </DropdownItem>
        <DropdownItem
          startContent={<ArrowRightFromLine size={18} />}
          key="left"
          className="text-danger"
          color="danger"
          onClick={async () => await signOutAction()}
        >
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
