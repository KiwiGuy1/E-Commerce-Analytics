"use client";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // On mount, check localStorage and set initial mode
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  const toggle = () => {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className="m-2 rounded-full border border-slate-300 bg-white dark:bg-black dark:border-purple-900 px-3 py-2 shadow hover:shadow-lg transition-colors text-sm font-semibold text-slate-700 dark:text-purple-200"
      aria-label="Toggle dark mode"
    >
      {dark ? "☀️ Light" : "🌑 Dark"}
    </button>
  );
}
