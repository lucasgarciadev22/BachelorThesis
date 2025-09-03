import type { Macros } from "./nutrition"

export const kcalFromMacros = (m: Macros) => ({
  Protein: m.protein * 4,
  Carbs: m.carbs * 4,
  Fat: m.fat * 9,
})

export const totalKcal = (m: Macros) => {
  const k = kcalFromMacros(m)
  return k.Protein + k.Carbs + k.Fat
}

export const pct = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0
