"use client";
import { createContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("oak-theme") as Theme | null;
    if (saved) apply(saved);
  }, []);

  function apply(t: Theme) {
    setTheme(t);
    document.documentElement.dataset.theme = t === "dark" ? "dark" : "";
    localStorage.setItem("oak-theme", t);
  }

  function toggle() {
    apply(theme === "light" ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
