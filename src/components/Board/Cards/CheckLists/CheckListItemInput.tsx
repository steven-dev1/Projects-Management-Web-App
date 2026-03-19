import { Button, Input } from "@heroui/react";
import { X } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  placeholder?: string;
}

export const ChecklistItemInput = ({
  value,
  onChange,
  onConfirm,
  onCancel,
  confirmLabel = "Guardar",
  placeholder = "Escribe un item...",
}: Props) => (
  <div className="flex flex-col gap-2">
    <Input
      size="sm"
      autoFocus
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onConfirm();
        if (e.key === "Escape") onCancel();
      }}
    />
    <div className="flex gap-2">
      <Button size="sm" variant="flat" color="primary" onPress={onConfirm}>
        {confirmLabel}
      </Button>
      <Button size="sm" variant="light" isIconOnly onPress={onCancel}>
        <X size={14} />
      </Button>
    </div>
  </div>
);