"use client";
import { ArrowRightFromLine, FolderOpenDot, Home, PanelsLeftBottom, Settings, Unlink } from "lucide-react";
import Link from "next/link";
import {
  Avatar,
  Divider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import ProfileDropdown from "./ProfileDropdown";
import NotificationsBell from "../Notifications/NotificationsBell";
import ButtonCreateProject from "../Dashboard/ButtonCreateProject";
import { ThemeToggle } from "../UI/ThemeToggle";
import { signOutAction } from "@/lib/SignOutAction";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { BoardSearch } from "../Board/BoardSearch";

export default function MainNavBar({isBoard} : { isBoard?: boolean }) {
  const { user, profile } = useAppSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Navbar
      maxWidth="full"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      position="sticky"
      isBordered
      isBlurred
      className="flex items-center border-b gap-2 bg-white dark:bg-zinc-900 dark:border-b-zinc-800 border-b-zinc-200 w-full sticky top-0 z-100 backdrop-blur-lg"
    >
      <NavbarContent>
        <NavbarMenuToggle className="sm:hidden" />
        <NavbarBrand>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Unlink color="#006fee" size="32" />
            <h1 className="text-xl hidden sm:block font-semibold">Projects M.</h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="center" className="hidden sm:flex">
        {isBoard && <BoardSearch />}
        <ButtonCreateProject size="md" />
      </NavbarContent>
      <NavbarContent justify="end">
        <div className="flex items-center gap-2">
          <NotificationsBell />
          <ButtonCreateProject className="flex sm:hidden" size="md" />
          <ProfileDropdown />
        </div>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem className="flex items-center gap-2 my-2">
          <Avatar isBordered src={profile?.avatar_url ?? undefined} name={profile?.full_name ?? "U"} size="md" />
          <div>
            <p className="text-sm font-medium">{profile?.full_name ?? "Usuario anónimo"}</p>
            <p className="text-xs text-zinc-400">{user?.email ?? "usuario@ejemplo.com"}</p>
          </div>
        </NavbarMenuItem>
        <Divider />
        <NavbarMenuItem className="my-1">
          <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <Home size={18} /> Inicio
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem className="my-1">
          <Link href="/dashboard/projects" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <FolderOpenDot size={18} /> Mis proyectos
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem className="my-1">
          <Link href="/dashboard/templates" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <PanelsLeftBottom size={18} /> Plantillas
          </Link>
        </NavbarMenuItem>
        <Divider className="my-1" />
        <NavbarMenuItem className="my-1">
          <ThemeToggle />
        </NavbarMenuItem>
        <NavbarMenuItem className="my-1">
          <Link href="/settings" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
            <Settings size={18} /> Ajustes
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem className="my-1 text-red-400">
          <button className="flex items-center  gap-2" onClick={async () => await signOutAction()}>
            <ArrowRightFromLine size={18} /> Cerrar sesión
          </button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
