import type { Macros } from "@/types/nutrition";

/** Using directly translated naming for keys to display directly in the graph **/
export const kcalFromMacros = (m: Macros) => ({
  Proteína: m.protein * 4,
  Carboidrato: m.carbs * 4,
  Gordura: m.fat * 9,
});

export const totalKcal = (m: Macros) => {
  const k = kcalFromMacros(m);
  return k.Proteína + k.Carboidrato + k.Gordura;
};

export const toPieData = (m: Macros) => {
  const kcal = kcalFromMacros(m);
  return Object.entries(kcal).map(([name, value]) => ({ name, value }));
};
