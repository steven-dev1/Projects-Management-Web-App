"use client";
import {
  Menu,
  Unlink,
} from "lucide-react";
import Link from "next/link";
import { Button,useDisclosure } from "@heroui/react";
import NavBarMobile from "./NavBarMobile";
import ProfileDropdown from "./ProfileDropdown";

export default function MainNavBar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <nav className="flex items-center border-b gap-2 p-4 bg-white border-b-zinc-200 w-full sticky top-0 z-10 backdrop-blur-lg">
      <div className="w-7xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Unlink color="#a742ff" size="32" />
          <h1 className="text-xl hidden sm:block font-semibold">Projects M.</h1>
        </Link>
        {/* MOBILE */}
        <Button variant="light" onPress={onOpen} className="sm:hidden">
          <Menu size={24} />
        </Button>
        <NavBarMobile isOpen={isOpen} onOpenChange={onOpenChange} />
        {/* DESKTOP */}
        <ProfileDropdown />
      </div>
    </nav>
  );
}
