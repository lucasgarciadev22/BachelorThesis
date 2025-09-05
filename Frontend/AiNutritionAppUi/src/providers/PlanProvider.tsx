import * as React from "react"
import type { WeekPlan } from "@/types/nutrition"
import { NutritionPlanCtx } from "@/contexts/NutritionPlanCtx"



export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = React.useState<WeekPlan | null>(() => {
    try {
      const raw = sessionStorage.getItem("nutrition.plan")
      return raw ? (JSON.parse(raw) as WeekPlan) : null
    } catch {
      return null
    }
  })

  React.useEffect(() => {
    if (plan) {
      sessionStorage.setItem("nutrition.plan", JSON.stringify(plan))
    } else {
      sessionStorage.removeItem("nutrition.plan")
    }
  }, [plan])

  return <NutritionPlanCtx.Provider value={{ plan, setPlan }}>{children}</NutritionPlanCtx.Provider>
}


