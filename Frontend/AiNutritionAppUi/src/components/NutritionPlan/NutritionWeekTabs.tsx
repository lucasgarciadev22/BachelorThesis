import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { friendlyDate } from "@/lib/utils/format";
import type { WeeklyPlanDto } from "@/types/nutrition";
import { DaySummary } from "../Macros/DaySummary";
import MealCard from "../Macros/MealCard";

export function NutritionWeekTabs({ plan }: { plan: WeeklyPlanDto }) {
  const firstDay = plan.days[0]?.date ?? "Dia 1";

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
          <DaySummary day={d} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {d.meals.map((m) => (
              <MealCard key={m.name + m.calories} meal={m} />
            ))}
          </div>

          {!!d.groceries?.length && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Lista de compras</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-sm text-muted-foreground grid grid-cols-2 md:grid-cols-3 gap-y-1">
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
