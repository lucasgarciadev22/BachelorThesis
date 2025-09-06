import type { FormValues } from "@/types/wizard";

export const STEP_FIELDS: (keyof FormValues)[][] = [
  ["goal"],
  ["dietaryPattern"],
  ["mealsPerDay", "targetCalories"],
  ["budget", "cookingSkill", "timePerMeal"],
  ["preferences", "dislikes", "allergies"],
];

export const PHRASES = [
  "Analisando seus gostos…",
  "Calculando macros ideais…",
  "Preparando receitas deliciosas…",
  "Otimizando custo e praticidade…",
  "Montando sua semana perfeita…",
];
