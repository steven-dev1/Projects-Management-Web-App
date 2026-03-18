"use client";
import { Menu, Unlink } from "lucide-react";
import Link from "next/link";
import { Button, Navbar, useDisclosure } from "@heroui/react";
import NavBarMobile from "./NavBarMobile";
import ProfileDropdown from "./ProfileDropdown";
import NotificationsBell from "../Notifications/NotificationsBell";
import ButtonCreateProject from "../Dashboard/ButtonCreateProject";

export default function MainNavBar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Navbar maxWidth="full" position="sticky" isBordered isBlurred className="flex items-center border-b gap-2 bg-white dark:bg-zinc-900 dark:border-b-zinc-800 border-b-zinc-200 w-full sticky top-0 z-100 backdrop-blur-lg">
      <div className="w-7xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Unlink color="#006fee" size="32" />
          <h1 className="text-xl hidden sm:block font-semibold">Projects M.</h1>
        </Link>
        {/* MOBILE */}
        <Button variant="light" onPress={onOpen} className="sm:hidden">
          <Menu size={24} />
        </Button>
        <NavBarMobile isOpen={isOpen} onOpenChange={onOpenChange} />
        {/* DESKTOP */}
        <ButtonCreateProject size="md" />
        <div className="flex items-center gap-2">
          <NotificationsBell />
          <ProfileDropdown />
        </div>
      </div>
    </Navbar>
  );
}
