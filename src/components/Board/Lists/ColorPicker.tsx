import { LIST_COLORS } from "@/lib/consts";
import { Tooltip } from "@heroui/react";
import { useTheme } from "next-themes";

export const ColorPicker = ({ value, onChange }: { value: string; onChange: (color: string) => void }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex flex-wrap gap-2 justify-between">
      {LIST_COLORS.map((color) => {
        const bg = isDark ? color.dark : color.light;
        const isSelected = value === color.id

        return (
          <Tooltip closeDelay={0} key={color.light} content={color.label} showArrow placement="top">
            <button
              type="button"
              onClick={() => onChange(color.id)}
              className={`
                w-7 h-7 rounded-full cursor-pointer border-2 transition-all duration-150 hover:scale-110
                ${isSelected ? "border-zinc-800 dark:border-white scale-110 shadow-md" : "border-zinc-400"}
              `}
              style={{ backgroundColor: bg }}
            />
          </Tooltip>
        );
      })}
    </div>
  );
};
