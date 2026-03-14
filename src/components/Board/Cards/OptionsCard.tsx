import { archiveCard } from "@/store/features/boards/CardsThunks";
import { useAppDispatch } from "@/store/hooks";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@heroui/react";
import { Ellipsis, PenBoxIcon, Trash2 } from "lucide-react";

export const OptionsCard = ({ cardId, onOpenDetail }: { cardId: string; onOpenDetail: () => void }) => {
  const dispatch = useAppDispatch();
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
            if (key === "edit") onOpenDetail();
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
    </>
  );
};
