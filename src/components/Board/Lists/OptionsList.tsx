import { archiveList } from "@/store/features/boards/ListsThunks";
import { useAppDispatch } from "@/store/hooks";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { useDisclosure } from "@heroui/react";
import { Archive, Ellipsis, PenBoxIcon } from "lucide-react";
import { EditListModal } from "./EditListModal";

export const OptionsList = ({ listId }: { listId: string }) => {
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <div className="p-1 hover:bg-zinc-700/10 rounded-lg cursor-pointer flex">
            <Ellipsis size={16} />
          </div>
        </DropdownTrigger>
        <DropdownMenu
          onAction={(key) => {
            if (key === "archive") dispatch(archiveList(listId));
            if (key === "edit") onOpen();
          }}
        >
          <DropdownItem startContent={<PenBoxIcon size={16} />} key={"edit"} className="flex items-center gap-2">
            Editar
          </DropdownItem>
          <DropdownItem
            startContent={<Archive size={16} />}
            key={"archive"}
            color="danger"
            className="flex items-center gap-2"
          >
            Archivar
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <EditListModal listId={listId} isOpen={isOpen} onClose={onClose} />
    </>
  );
};
