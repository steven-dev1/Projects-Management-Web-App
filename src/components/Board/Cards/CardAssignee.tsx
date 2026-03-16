import { Card } from "@/store/features/boards/BoardsTypes";
import { assignCard } from "@/store/features/boards/CardsThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Avatar } from "@heroui/avatar";
import { Button, Input } from "@heroui/react";
import { Check, Search, UserX } from "lucide-react";
import { useState } from "react";

export const CardAssignee = ({ card, isBoardClosed }: { card: Card; isBoardClosed: boolean }) => {
  const dispatch = useAppDispatch();
  const members = useAppSelector((state) => state.boards.currentBoard?.board_members ?? []);
  const [search, setSearch] = useState("");

  const filteredMembers = members.filter((member) =>
    member.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Asignado a</p>

      {isBoardClosed ? (
        <div className="flex items-center gap-2 p-1.5">
          {card.assigned_to ? (
            (() => {
              const assignedMember = members.find((m) => m.user_id === card.assigned_to);
              return (
                <>
                  <Avatar
                    src={assignedMember?.profiles?.avatar_url ?? undefined}
                    name={assignedMember?.profiles?.full_name ?? "U"}
                    size="sm"
                    className="w-6 h-6 shrink-0"
                  />
                  <span className="text-xs text-zinc-700">{assignedMember?.profiles?.full_name}</span>
                </>
              );
            })()
          ) : (
            <div className="flex min-w-0 w-full items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
                <UserX size={12} className="text-zinc-400" />
              </div>
              <span className="text-xs w-full text-zinc-500 truncate">Sin asignar</span>
            </div>
          )}
        </div>
      ) : (
        <>
          <Input
            size="sm"
            placeholder="Buscar miembro..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={<Search size={12} className="text-zinc-400" />}
            isClearable
            onClear={() => setSearch("")}
          />
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
            <Button
              type="button"
              variant="light"
              onPress={() => dispatch(assignCard({ cardId: card.id!, userId: null }))}
              className={`flex justify-start items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-left ${
                !card.assigned_to ? "bg-zinc-100" : ""
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
                <UserX size={12} className="text-zinc-400" />
              </div>
              <span className="text-xs text-zinc-500">Sin asignar</span>
            </Button>
            {filteredMembers.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-2">Sin resultados</p>
            ) : (
              filteredMembers.map((member) => (
                <Button
                  key={member.id}
                  type="button"
                  variant="light"
                  onPress={() => dispatch(assignCard({ cardId: card.id!, userId: member.user_id }))}
                  className={`flex outline-none items-center justify-start gap-2 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors text-left ${
                    card.assigned_to === member.user_id ? "bg-zinc-100" : ""
                  }`}
                >
                  <Avatar
                    src={member.profiles?.avatar_url ?? undefined}
                    name={member.profiles?.full_name ?? "U"}
                    size="sm"
                    className="w-6 h-6 shrink-0"
                  />
                  <span className="text-xs text-zinc-700 truncate">{member.profiles?.full_name}</span>
                  {card.assigned_to === member.user_id && (
                    <Check size={14} className="text-emerald-500 ml-auto shrink-0" />
                  )}
                </Button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
