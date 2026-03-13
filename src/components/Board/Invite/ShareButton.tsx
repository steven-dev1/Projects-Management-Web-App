import { Button, useDisclosure } from "@heroui/react";
import { UserPlus } from "lucide-react";
import { InviteModal } from "./InviteModal";

export default function ShareButton({ boardId }: { boardId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button variant="light" color="default" startContent={<UserPlus size={18} />} onPress={onOpen}>
        Compartir
      </Button>
      <InviteModal boardId={boardId} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
