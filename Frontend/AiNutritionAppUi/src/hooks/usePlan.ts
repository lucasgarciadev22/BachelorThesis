import { NutritionPlanCtx } from "@/contexts/NutritionPlanCtx";
import React from "react";

export function usePlan() {
  const ctx = React.useContext(NutritionPlanCtx);
  if (!ctx) throw new Error("usePlan must be used within PlanProvider");
  return ctx;
}
