import { LIST_COLORS } from "@/lib/consts";
import { Tooltip } from "@heroui/react";

export const ColorPicker = ({ value, onChange }: { value: string; onChange: (color: string) => void }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {LIST_COLORS.map((color) => (
        <Tooltip key={color.value} content={color.label} showArrow placement="top">
          <button
            type="button" // importante: evita que submit el form
            onClick={() => onChange(color.value)}
            className={`
              w-7 h-7 rounded-full cursor-pointer border-2 transition-all duration-150 hover:scale-110
              ${value === color.value ? "border-zinc-800 scale-110 shadow-md" : "border-zinc-400"}
            `}
            style={{ backgroundColor: color.value }}
          />
        </Tooltip>
      ))}
    </div>
  );
};