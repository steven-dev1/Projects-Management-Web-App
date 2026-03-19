"use client";
import { signOutAction } from "@/lib/actions/SignOutAction";
import { useAppSelector } from "@/store/hooks";
import { Avatar } from "@heroui/avatar";
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@heroui/dropdown";
import { Skeleton } from "@heroui/react";
import { ArrowRightFromLine, FolderOpenDot, Settings } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../UI/ThemeToggle";

export default function ProfileDropdown() {
  const { user, profile, isLoading } = useAppSelector((state) => state.auth);
  return (
    <Dropdown closeOnSelect={false} suppressHydrationWarning className="items-center gap-2">
      <DropdownTrigger className="cursor-pointer hidden sm:flex">
        {isLoading ? (
          <Skeleton className="w-10 h-10 rounded-full" />
        ) : (
          <Avatar
            id="profile-avatar-btn"
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
        <DropdownSection showDivider>
          <DropdownItem key="profile" className="flex items-center gap-2">
            <p className="text-sm font-medium">{profile?.full_name ?? "Usuario anónimo"}</p>
            <p className="text-xs text-zinc-400">{user?.email ?? "usuario@ejemplo.com"}</p>
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
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
          <DropdownItem key="theme">
            <ThemeToggle />
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
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
