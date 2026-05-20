"use client";
import { useContext } from "react";
import { LangContext } from "@/components/providers/lang-provider";

export function useLang() {
  return useContext(LangContext);
}
