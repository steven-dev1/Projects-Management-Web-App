import { Input, Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import { SearchIcon, Unlink } from "lucide-react";
import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";
import ButtonCreateProject from "../Dashboard/ButtonCreateProject";

export default function BoardNavBar() {
  return (
    <Navbar maxWidth="full" position="sticky" isBordered isBlurred className="p-1">
      <NavbarContent justify="start">
        <NavbarBrand>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Unlink color="#a742ff" size="32" />
            <h1 className="text-xl hidden sm:block font-semibold">Projects M.</h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent justify="center" className="hidden sm:flex gap-3 items-center">
        <Input
        color="default"
          classNames={{
            base: "h-10",
            mainWrapper: "h-full",
            input: "text-small",
          }}
          placeholder="Buscar"
          size="md"
          startContent={<SearchIcon size={18} />}
          type="search"
          isClearable
        />
        <ButtonCreateProject size="md" />
      </NavbarContent>
      <NavbarContent justify="end" className="hidden sm:flex gap-3">
        <ProfileDropdown />
      </NavbarContent>
    </Navbar>
  );
}
