import { formatPct, friendlyDate } from "@/lib/utils/format"
import  { Card, CardContent } from '../ui/card'
import MacroPie from "./MacroPie"
import type { DayPlan } from "@/types/nutrition"
import { kcalFromMacros } from "@/lib/utils/macros"

export function DaySummary({ day }: { day: DayPlan }) {
  const kcal = kcalFromMacros(day.macros)
  const total = Object.values(kcal).reduce((s, v) => s + v, 0)
  const pct = {
    p: formatPct(kcal.Protein, total),
    c: formatPct(kcal.Carbs, total),
    f: formatPct(kcal.Fat, total),
  }

  return (
    <Card className="mb-4">
      <CardContent className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <div className="text-sm text-muted-foreground">{friendlyDate(day.date)}</div>
          <div className="text-2xl font-semibold">{day.totalCalories} kcal</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Prot {day.macros.protein}g ({pct.p}) • Carb {day.macros.carbs}g ({pct.c}) • Gord {day.macros.fat}g ({pct.f})
          </div>
        </div>
        <MacroPie macros={day.macros} />
      </CardContent>
    </Card>
  )
}