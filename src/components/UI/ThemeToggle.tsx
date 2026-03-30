"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ iconOnly = false }: { iconOnly?: boolean }) {
  const { theme, setTheme } = useTheme();
  return (
    <button
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      type="button"
      className="cursor-pointer w-full text-center flex gap-2 items-center"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <>
          {iconOnly ? (
            <Sun size={18} />
          ) : (
            <>
              <Sun size={18} /> Modo claro 
            </>
          )}
        </>
      ) : (
        <>
          {iconOnly ? (
            <Moon size={18} />
          ) : (
            <>
              <Moon size={18} /> Modo oscuro 
            </>
          )}
        </>
      )}
    </button>
  );
}
