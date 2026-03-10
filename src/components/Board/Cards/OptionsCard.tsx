import { archiveCard } from "@/store/features/boards/CardsThunks";
import { useAppDispatch } from "@/store/hooks";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@heroui/react";
import { Ellipsis, PenBoxIcon, Trash2 } from "lucide-react";
import { EditCardModal } from "./EditCardModal";

export const OptionsCard = ({ cardId }: { cardId: string }) => {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <div className="bg-zinc-100 p-1 rounded-lg cursor-pointer flex">
            <Ellipsis size={16} />
          </div>
        </DropdownTrigger>
        <DropdownMenu
          onAction={(key) => {
            if (key === "archive") dispatch(archiveCard(cardId));
            if (key === "edit") onOpen();
          }}
        >
          <DropdownItem startContent={<PenBoxIcon size={16} />} key={"edit"} className="flex items-center gap-2">
            Editar
          </DropdownItem>
          <DropdownItem
            startContent={<Trash2 size={16} />}
            key={"archive"}
            color="danger"
            className="flex items-center gap-2"
          >
            Archivar
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <EditCardModal cardId={cardId} isOpen={isOpen} onClose={onClose} />
    </>
  );
};
