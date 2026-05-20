"use client";
import { createContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { Lang } from "@/types/i18n";
import { makeT } from "@/mock/strings";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

export const LangContext = createContext<LangContextValue>({
  lang: "th",
  setLang: () => {},
  t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("th");

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
  }, []);

  const t = useMemo(() => makeT(lang), [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}
