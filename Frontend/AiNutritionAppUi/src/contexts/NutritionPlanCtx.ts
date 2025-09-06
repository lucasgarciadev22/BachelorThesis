import type { WeeklyPlanDto } from "@/types/nutrition";
import React from "react";

type NutritionPlanCtx = {
  plan: WeeklyPlanDto | null;
  setPlan: (p: WeeklyPlanDto | null) => void;
};

export const NutritionPlanCtx = React.createContext<
  NutritionPlanCtx | undefined
>(undefined);
