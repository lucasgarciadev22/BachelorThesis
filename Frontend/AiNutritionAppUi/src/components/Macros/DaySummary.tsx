import { formatPct, friendlyDate } from "@/lib/utils/format";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { AlertTriangle } from "lucide-react";
import MacroPie from "./MacroPie";
import type { DayPlan } from "@/types/nutrition";
import { kcalFromMacros } from "@/lib/utils/macros";

export function DaySummary({ day }: { day: DayPlan }) {
  const kcal = kcalFromMacros(day.macros);
  const total = Object.values(kcal).reduce((s, v) => s + v, 0);
  const pct = {
    p: formatPct(kcal.Proteína, total),
    c: formatPct(kcal.Carboidrato, total),
    f: formatPct(kcal.Gordura, total),
  };

  const warnings = day.safetyReview?.warnings ?? [];

  return (
    <Card className="mb-4">
      <CardContent className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <div className="text-sm text-muted-foreground">
            {friendlyDate(day.date)}
          </div>
          <div className="text-2xl font-semibold">{day.totalCalories} kcal</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Proteína {day.macros.protein}g ({pct.p}) • Carboidrato
            {day.macros.carbs}g ({pct.c}) • Gordura {day.macros.fat}g ({pct.f})
          </div>

          {warnings.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {warnings.map((w, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="gap-1 whitespace-normal bg-amber-100 text-yellow-600"
                >
                  <AlertTriangle className="h-3 w-3" />
                  {w}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <MacroPie macros={day.macros} />
      </CardContent>
    </Card>
  );
}
