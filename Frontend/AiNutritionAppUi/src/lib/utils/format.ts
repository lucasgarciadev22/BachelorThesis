import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toPercent = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0

export const formatPct = (value: number, total: number) =>
  total > 0 ? `${Math.round((value / total) * 100)}%` : "0%"

export const friendlyDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  })

export function csvToArray(s?: string) {
  return (s ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
}