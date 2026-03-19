"use client";
import { ThemeToggle } from "@/components/UI/ThemeToggle";
import { Unlink, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "./LandingData";

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-900 backdrop-blur-md border-b dark:border-zinc-800 border-zinc-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
        <Link href="/" className="text-lg flex items-center gap-2 font-semibold tracking-tight">
          <Unlink color="#006fee" size={28} />
          <span>Projects M.</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-sm text-zinc-500 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-400 transition-colors no-underline"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/signin"
              className="text-sm text-zinc-500 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-400 transition-colors no-underline"
            >
              Iniciar sesión
            </Link>
          </li>
          <li>
            <Link
              href="/signup"
              className="text-sm font-medium bg-zinc-900 dark:bg-white dark:text-zinc-950 text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-85 no-underline"
            >
              Empezar gratis
            </Link>
          </li>
          <li>
            <ThemeToggle iconOnly />
          </li>
        </ul>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle iconOnly />
          <button onClick={() => setMenuOpen((v) => !v)} className="p-1 text-zinc-600 dark:text-zinc-300">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t dark:border-zinc-800 border-zinc-200 bg-white dark:bg-zinc-900 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-zinc-600 dark:text-zinc-200 no-underline"
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/signin"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-zinc-600 dark:text-zinc-200 no-underline"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/signup"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-medium bg-zinc-900 dark:bg-white dark:text-zinc-950 text-white px-4 py-2 rounded-lg text-center no-underline"
          >
            Empezar gratis
          </Link>
        </div>
      )}
    </nav>
  );
}
