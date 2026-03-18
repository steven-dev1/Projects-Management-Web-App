"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      className="cursor-pointer w-full text-center flex gap-2 items-center"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
       {theme === "dark" ? <>Modo claro <Sun size={18} /></> : <>Modo oscuro <Moon size={18} /></>} 
    </button>
  );
}