import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import { Unlink } from "lucide-react";
import Link from "next/link";
import ProfileDropdown from "../NavBar/ProfileDropdown";
import ButtonCreateProject from "../Dashboard/ButtonCreateProject";
import { BoardSearch } from "./BoardSearch";
import NotificationsBell from "../Notifications/NotificationsBell";

export default function BoardNavBar() {
  return (
    <Navbar maxWidth="full" position="sticky" isBordered isBlurred className="p-1">
      <NavbarContent justify="start">
        <NavbarBrand>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Unlink color="#006fee" size="32" />
            <h1 className="text-xl hidden sm:block font-semibold">Projects M.</h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="center" className="hidden sm:flex gap-3 items-center flex-1 max-w-4xl">
        <BoardSearch />
        <ButtonCreateProject size="md" />
      </NavbarContent>
      <NavbarContent justify="end" className="hidden sm:flex gap-3">
        <NotificationsBell />
        <ProfileDropdown />
      </NavbarContent>
    </Navbar>
  );
}
