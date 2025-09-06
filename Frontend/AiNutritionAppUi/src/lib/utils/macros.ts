import type { Macros } from "../types/nutrition";

export const kcalFromMacros = (m: Macros) => ({
  Protein: m.protein * 4,
  Carbs: m.carbs * 4,
  Fat: m.fat * 9,
});

export const totalKcal = (m: Macros) => {
  const k = kcalFromMacros(m);
  return k.Protein + k.Carbs + k.Fat;
};

export const toPieData = (m: Macros) => {
  const kcal = kcalFromMacros(m);
  return Object.entries(kcal).map(([name, value]) => ({ name, value }));
};
