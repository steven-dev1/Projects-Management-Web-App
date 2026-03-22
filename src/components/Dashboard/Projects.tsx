"use client";
import { Board } from "@/store/features/boards/BoardsTypes";
import ButtonCreateProject from "./ButtonCreateProject";
import { Select, SelectItem } from "@heroui/react";
import { FILTER_OPTIONS_BOARDS } from "@/lib/consts";
import { useMemo, useState } from "react";
import ProjectsList from "./ProjectsList";
import Link from "next/link";

export default function Projects({ boards }: { boards: Board[] }) {
  const [filter, setFilter] = useState("recent");

  const view = useMemo(() => {
    switch (filter) {
      case "a-z":
        return [...boards].sort((a, b) => a.name.localeCompare(b.name));

      case "z-a":
        return [...boards].sort((a, b) => b.name.localeCompare(a.name));

      case "recent":
        return [...boards].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      case "oldest":
        return [...boards].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      default:
        return boards;
    }
  }, [boards, filter]);

  return (
    <div className="w-full flex flex-col gap-2 justify-center">
      <div className="flex flex-col lg:flex-row items-center justify-center md:justify-between gap-4 mt-2 mb-4">
        <Select
          label="Ordenar por"
          className="max-w-xs"
          labelPlacement="inside"
          defaultSelectedKeys={["recent"]}
          placeholder="Selecciona un filtro"
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            setFilter(selected);
          }}
        >
          {FILTER_OPTIONS_BOARDS.map((option) => (
            <SelectItem key={option.value}>{option.label}</SelectItem>
          ))}
        </Select>

        <div className="flex items-center gap-2">
          <ButtonCreateProject size="md" />
          <Link href="/dashboard/archived" className="dark:bg-zinc-900 dark:hover:bg-zinc-800 bg-zinc-100 hover:bg-zinc-200  text-sm dark:text-zinc-300 p-3 rounded-xl">
              Ver tableros archivados
          </Link>
        </div>
      </div>
      <ProjectsList boards={view} />
    </div>
  );
}
