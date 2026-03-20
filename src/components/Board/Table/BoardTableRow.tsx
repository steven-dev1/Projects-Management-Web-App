"use client";
import { Card } from "@/store/features/boards/BoardsTypes";
import { BoardMember } from "@/types";
import { Avatar, Chip, Tooltip } from "@heroui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";
import { Check, CheckSquare, Minus } from "lucide-react";

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
      className="border-b border-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900 hover:bg-zinc-50 cursor-pointer transition-colors"
      onClick={onOpen}
    >
      {/* Título */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-zinc-800 dark:text-zinc-300 ${card.is_completed ? "text-zinc-400" : ""}`}>
            {card.title}
          </span>
          {totalItems > 0 && (
            <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-200">
              <CheckSquare size={12} />
              {completedItems}/{totalItems}
            </span>
          )}
        </div>
      </td>

      {/* Lista */}
      <td className="px-4 py-3">
        <span className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-200 px-2 py-1 rounded-full">
          {listName}
        </span>
      </td>

      {/* Asignado */}
      <td className="px-4 py-3 hidden lg:table-cell">
        {assignedMember ? (
          <div className="flex items-center gap-2">
            <Avatar
              src={assignedMember.profiles?.avatar_url ?? undefined}
              name={assignedMember.profiles?.full_name ?? "U"}
              size="sm"
              className="w-6 h-6"
            />
            <span className="text-xs text-zinc-600 dark:text-zinc-300">{assignedMember.profiles?.full_name}</span>
          </div>
        ) : (
          <span className="text-xs text-zinc-400">—</span>
        )}
      </td>

      {/* Fecha límite */}
      <td className="px-4 py-3 hidden md:table-cell">
        {card.due_date ? (
          <span
            className={`text-xs ${new Date(card.due_date) < new Date() && !card.is_completed ? "text-red-500 font-medium" : "text-zinc-600 dark:text-zinc-300"}`}
          >
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
            <Tooltip closeDelay={0} key={label.id} content={label.name} showArrow placement="top">
              <div
                className="text-xs px-2 py-0.5 h-1.5 rounded-full text-white"
                style={{ backgroundColor: label.color }}
              ></div>
            </Tooltip>
          ))}
          {!card.labels?.length && <span className="text-xs text-zinc-400">—</span>}
        </div>
      </td>

      {/* Estado */}
      <td className="px-4 py-3">
        <Chip size="sm" variant="flat" color={card.is_completed ? "success" : "default"}>
          <span className="hidden md:flex">{card.is_completed ? "Completada" : "Pendiente"}</span>
          <span className="flex md:hidden">{card.is_completed ? <Check size={14}/> : <Minus size={14}/>}</span>
        </Chip>
      </td>
    </tr>
  );
}
