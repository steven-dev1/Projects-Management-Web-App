"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import {
  ArrowRightFromLine,
  FolderOpenDot,
  Menu,
  Settings,
  Unlink,
} from "lucide-react";
import { Avatar } from "@heroui/avatar";
import { signOutAction } from "../../lib/SignOutAction";
import Link from "next/link";
import { Button, Skeleton, useDisclosure } from "@heroui/react";
import NavBarMobile from "./NavBarMobile";
import { useAppSelector } from "@/store/hooks";

export default function MainNavBar() {
  const { profile} = useAppSelector(state => state.auth) 
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex items-center border-b gap-2 p-4 border-b-zinc-200 ">
      <div className="w-7xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Unlink color="#7828c8" size="32" />
          <h1 className="text-xl font-semibold">Projects M.</h1>
        </Link>
        {/* MOBILE */}
        <Button variant="light" onPress={onOpen} className="sm:hidden">
          <Menu size={24} />
        </Button>
        <NavBarMobile isOpen={isOpen} onOpenChange={onOpenChange} />
        {/* DESKTOP */}
        <Dropdown className="items-center gap-2 hidden sm:flex">
          <DropdownTrigger className="cursor-pointer hidden sm:flex">
            {profile?.avatar_url ? (
              <Avatar
                isBordered
                radius="full"
                color="default"
                name={profile?.full_name}
                src={profile?.avatar_url}
                size="md"
              />
              ) : (
                <Skeleton className="w-10 h-10 rounded-full" />
              )}
          </DropdownTrigger>
          <DropdownMenu variant="flat">
            <DropdownItem key="projects">
              <Link href="/projects" className="flex items-center gap-2">
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
      </div>
    </div>
  );
}
