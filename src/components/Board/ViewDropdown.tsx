"use client";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Button } from "@heroui/react";
import { ChevronDown, LayoutPanelLeft, PieChart, Table } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ViewDropdown({ boardId }: { boardId: string }) {
  const pathname = usePathname();
  const isInsideBoard = pathname.startsWith("/boards/");

  const pathParts = pathname.split("/").filter(Boolean);

  const isBoardView = isInsideBoard && pathParts.length === 2;
  const isTableView = isInsideBoard && pathParts.length === 3 && pathParts[2] === "table";
  const isPanelView = isInsideBoard && pathParts.length === 3 && pathParts[2] === "panel";
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="flat" endContent={<ChevronDown size={18} />}>
          {isBoardView ? (
            <LayoutPanelLeft size={18} />
          ) : isTableView ? (
            <Table size={18} />
          ) : isPanelView ? (
            <PieChart size={18} />
          ) : (
            ""
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
        <DropdownItem textValue="Tablero" key="board" startContent={<LayoutPanelLeft size={18} />}>
          <Link href={`/boards/${boardId}`}>Tablero</Link>
        </DropdownItem>
        <DropdownItem textValue="Tabla" key="table" startContent={<Table size={18} />}>
          <Link href={`/boards/${boardId}/table`}>Tabla</Link>
        </DropdownItem>
        <DropdownItem textValue="Panel" key="panel" startContent={<PieChart size={18} />}>
          <Link href={`/boards/${boardId}/panel`}>Panel</Link>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
