'use client'
import { Dropdown,DropdownItem,DropdownMenu,DropdownTrigger} from "@heroui/dropdown";
import { ArrowRightFromLine, FolderOpenDot, Menu, Settings, Unlink } from "lucide-react";
import { useUserWithProfile } from "@/hooks/useUserWithProfile";
import { Avatar } from "@heroui/avatar";
import { signOutAction } from "../Auth/SignOutAction";
import Link from "next/link";
import { Button, Skeleton, useDisclosure } from "@heroui/react";
import NavBarMobile from "./NavBarMobile";

export default function MainNavBar() {
  const { profile, isLoading } = useUserWithProfile()
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

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
            {isLoading ? (
                <Skeleton className="w-8 h-8 rounded-xl" />
            ):(
                <Avatar 
                as="button" 
                className="transition-transform" 
                isBordered 
                radius="md" 
                color="secondary" 
                showFallback 
                name={profile?.full_name} 
                size="sm" />
            )}
          </DropdownTrigger>
          <DropdownMenu variant="flat">
            <DropdownItem startContent={<FolderOpenDot size={18}/>} key="projects">Mis proyectos</DropdownItem>
            <DropdownItem startContent={<Settings size={18}/>} key="settings">Ajustes</DropdownItem>
            <DropdownItem startContent={<ArrowRightFromLine size={18}/>} key="left" className="text-danger" color="danger" onClick={ async () => await signOutAction() }>
              Cerrar sesión
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}
