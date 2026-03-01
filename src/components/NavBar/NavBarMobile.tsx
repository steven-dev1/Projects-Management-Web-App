import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@heroui/react";
import { ArrowRightFromLine, FolderOpenDot, Settings, Unlink } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "../../lib/SignOutAction";

export default function NavBarMobile({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <Drawer className="sm:hidden" size="full" isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Unlink color="#7828c8" size="32" />
                <h1 className="text-xl font-semibold">Projects M.</h1>
              </Link>
            </DrawerHeader>
            <DrawerBody>
              <Link href="/projects" className="py-2 flex gap-2 items-center px-4 rounded-lg hover:bg-zinc-100">
                <FolderOpenDot />
                <p>Mis proyectos</p>
              </Link>
              <Link href="/settings" className="py-2 flex gap-2 items-center px-4 rounded-lg hover:bg-zinc-100">
                <Settings />
                <p>Ajustes</p>
              </Link>
              <button onClick={ async () => await signOutAction() } className="py-2 flex gap-2 cursor-pointer items-center px-4 rounded-lg hover:bg-[#fdd0df]">
                <ArrowRightFromLine color="#f31965"/>
                <span className="text-[#f31965]">Cerrar sesión</span>
              </button>
            </DrawerBody>
            <DrawerFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
