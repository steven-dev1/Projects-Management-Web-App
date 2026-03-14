"use client";
import { Card } from "@/store/features/boards/BoardsTypes";
import { BoardMember } from "@/types";
import { Avatar, Chip } from "@heroui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { CheckSquare } from "lucide-react";

interface Props {
  card: Card;
  listName: string;
  members: BoardMember[];
  onOpen: () => void;
}

export default function BoardTableRow({ card, listName, members, onOpen }: Props) {
  const assignedMember = members.find((m) => m.user_id === card.assigned_to);

  const completedItems = card.checklists?.flatMap((c) => c.items).filter((i) => i.is_completed).length ?? 0;
  const totalItems = card.checklists?.flatMap((c) => c.items).length ?? 0;

  return (
    <tr
      className="border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer transition-colors"
      onClick={onOpen}
    >
      {/* Título */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-zinc-800 ${card.is_completed ? "line-through text-zinc-400" : ""}`}>
            {card.title}
          </span>
          {totalItems > 0 && (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <CheckSquare size={12} />
              {completedItems}/{totalItems}
            </span>
          )}
        </div>
      </td>

      {/* Lista */}
      <td className="px-4 py-3">
        <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded-full">
          {listName}
        </span>
      </td>

      {/* Asignado */}
      <td className="px-4 py-3">
        {assignedMember ? (
          <div className="flex items-center gap-2">
            <Avatar
              src={assignedMember.profiles?.avatar_url ?? undefined}
              name={assignedMember.profiles?.full_name ?? "U"}
              size="sm"
              className="w-6 h-6"
            />
            <span className="text-xs text-zinc-600">{assignedMember.profiles?.full_name}</span>
          </div>
        ) : (
          <span className="text-xs text-zinc-400">—</span>
        )}
      </td>

      {/* Fecha límite */}
      <td className="px-4 py-3">
        {card.due_date ? (
          <span className={`text-xs ${new Date(card.due_date) < new Date() && !card.is_completed ? "text-red-500 font-medium" : "text-zinc-600"}`}>
            {format(new Date(card.due_date), "dd MMM yyyy", { locale: es })}
          </span>
        ) : (
          <span className="text-xs text-zinc-400">—</span>
        )}
      </td>

      {/* Labels */}
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {card.labels?.map((label) => (
            <span
              key={label.id}
              className="text-xs px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
          {!card.labels?.length && <span className="text-xs text-zinc-400">—</span>}
        </div>
      </td>

      {/* Estado */}
      <td className="px-4 py-3">
        <Chip
          size="sm"
          variant="flat"
          color={card.is_completed ? "success" : "default"}
        >
          {card.is_completed ? "Completada" : "Pendiente"}
        </Chip>
      </td>
    </tr>
  );
}