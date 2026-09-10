"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ light }: { light?: boolean }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage blocked — fine, choice just won't persist */
    }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      aria-pressed={dark ?? false}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-500 ${
        light
          ? "text-white hover:bg-white/10"
          : "text-forest-700 hover:bg-forest-50 dark:text-forest-200 dark:hover:bg-white/10"
      }`}
    >
      <Sun className="h-5 w-5 dark:hidden" strokeWidth={1.75} />
      <Moon className="hidden h-5 w-5 dark:block" strokeWidth={1.75} />
    </button>
  );
}
