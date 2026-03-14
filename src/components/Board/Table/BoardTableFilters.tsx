"use client";
import { BoardList } from "@/store/features/boards/BoardsTypes";
import { Select, SelectItem } from "@heroui/react";

interface Props {
  lists: BoardList[];
  filterListId: string | null;
  onFilterChange: (listId: string | null) => void;
}

export default function BoardTableFilters({ lists, filterListId, onFilterChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <Select
        size="sm"
        placeholder="Filtrar por lista"
        className="w-48"
        selectedKeys={filterListId ? [filterListId] : []}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0] as string;
          onFilterChange(key ?? null);
        }}
      >
        {lists.map((list) => (
          <SelectItem key={list.id}>{list.title}</SelectItem>
        ))}
      </Select>

      {filterListId && (
        <button className="text-xs text-zinc-400 hover:text-zinc-600" onClick={() => onFilterChange(null)}>
          Limpiar filtro
        </button>
      )}
    </div>
  );
}
