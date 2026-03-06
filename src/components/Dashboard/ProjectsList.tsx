import { BoardResponse } from "@/store/features/boards/BoardsTypes";
import ProjectCard from "./ProjectCard";
import ButtonCreateProject from "./ButtonCreateProject";
import { Select, SelectItem } from "@heroui/react";
import { FILTER_OPTIONS_BOARDS } from "@/lib/consts";
import { useMemo, useState } from "react";

export default function ProjectsList({ boards }: { boards: BoardResponse[] }) {
  const [filter, setFilter] = useState("a-z");

  const view = useMemo(() => {
    switch (filter) {
      case "a-z":
        return [...boards].sort((a, b) => a.name.localeCompare(b.name));

      case "z-a":
        return [...boards].sort((a, b) => b.name.localeCompare(a.name));

      case "recent":
        return [...boards].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

      case "oldest":
        return [...boards].sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());

      default:
        return boards;
    }
  }, [boards, filter]);

  return (
    <div className="w-full flex flex-col gap-2 justify-center">
      <h1 className="text-xl font-bold text-center md:text-left">Proyectos</h1>
      <div className="flex flex-col sm:flex-row items-center justify-center md:justify-between gap-4 mt-2 mb-4">
        <Select
          label="Ordenar por"
          className="max-w-xs"
          labelPlacement="inside"
          defaultSelectedKeys={["a-z"]}
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

        <ButtonCreateProject size="md" />
      </div>
      <div className="w-full grid gap-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        {view.map((board: BoardResponse) => (
          <ProjectCard key={board.id} board={board} />
        ))}
      </div>
    </div>
  );
}
