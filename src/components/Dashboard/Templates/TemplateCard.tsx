"use client";

import { BoardTemplate } from "@/lib/templates";
import { Button, useDisclosure } from "@heroui/react";
import TemplateModal from "./TemplateModal";

export default function TemplateCard({ template }: { template: BoardTemplate }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div
        className={`rounded-xl template-card p-5 border border-zinc-300 flex justify-between flex-col gap-4 cursor-pointer transition-all duration-250`}
        onClick={onOpen}
        style={{ "--card-color": template.color } as React.CSSProperties}
      >
        <div className="h-1.5 rounded-full w-full" style={{ backgroundColor: template.color ?? "#006fee" }} />
        <div className="flex flex-col items-center gap-3">
          <span className="text-3xl text-center">{template.icon}</span>
          <div className="text-center">
            <h3 className="font-semibold text-zinc-800">{template.name}</h3>
            <p className="text-xs font-medium text-zinc-600 mt-0.5">{template.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-center flex-wrap gap-1.5">
          {template.lists.slice(0, 3).map((list) => (
            <span
              key={list.name}
              className="text-xs font-medium bg-white text-zinc-600 px-2 py-0.5 rounded-full border border-zinc-200"
            >
              {list.name}
            </span>
          ))}
        </div>

        <Button variant="flat" className="text-xs font-medium text-zinc-800">
          Usar plantilla
        </Button>
      </div>

      <TemplateModal template={template} isOpen={isOpen} onClose={onClose} />
    </>
  );
}
