import type { WeekPlan } from "@/types/nutrition"
import React from "react"

type NutritionPlanCtx = {
  plan: WeekPlan | null
  setPlan: (p: WeekPlan | null) => void
}

export const NutritionPlanCtx = React.createContext<NutritionPlanCtx | undefined>(undefined)