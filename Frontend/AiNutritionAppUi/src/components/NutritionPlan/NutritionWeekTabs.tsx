import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { friendlyDate } from "@/lib/utils/format";
import type { WeeklyPlanDto } from "@/types/nutrition";
import { DaySummary } from "../Macros/DaySummary";
import MealCard from "../Macros/MealCard";
import { Badge } from "../ui/badge";
import { AlertTriangle, InfoIcon, ShoppingBasket } from "lucide-react";

export function NutritionWeekTabs({ plan }: { plan: WeeklyPlanDto }) {
  const firstDay = plan.days[0]?.date ?? "Dia 1";
  const checkedAllergens = plan.safetyReview?.checkedAllergens ?? [];

  return (
    <Tabs defaultValue={firstDay} className="w-full">
      <TabsList className="flex flex-wrap gap-1">
        {plan.days.map((d) => (
          <TabsTrigger key={d.date} value={d.date} className="capitalize">
            {friendlyDate(d.date)}
          </TabsTrigger>
        ))}
      </TabsList>

      {plan.days.map((d) => (
        <TabsContent key={d.date} value={d.date} className="mt-4">
          {checkedAllergens.length > 0 && (
            <div>
              <p className="font-semibold text-sm">Alérgicos:</p>
              <div className="mb-4 mt-4 flex flex-wrap gap-2 justify-center">
                {checkedAllergens.map((w, i) => (
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
            </div>
          )}

          <Badge
            key={plan.weekStart}
            variant="outline"
            className="gap-1 mb-4 whitespace-normal bg-purple-100 text-purple-600"
          >
            <InfoIcon className="h-3 w-3" />
            {plan.safetyReview?.notes}
          </Badge>

          <DaySummary day={d} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {d.meals.map((m) => (
              <MealCard key={m.name + m.calories} meal={m} />
            ))}
          </div>

          {!!d.groceries?.length && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-foreground">
                  <ShoppingBasket
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                  Lista de compras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 text-sm text-muted-foreground grid grid-cols-2 md:grid-cols-3 gap-y-1 justify-items-start">
                  {d.groceries.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
