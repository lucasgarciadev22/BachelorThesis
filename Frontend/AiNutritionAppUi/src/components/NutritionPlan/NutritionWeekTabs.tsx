import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

type Macros = { protein: number; carbs: number; fat: number }

type Meal = {
  name: string
  description: string
  calories: number
  macros: Macros
  ingredients: string[]
  recipeUrl?: string | null
}

type DayPlan = {
  date: string
  totalCalories: number
  macros: Macros
  meals: Meal[]
  groceries: string[]
}

type WeekPlan = {
  weekStart: string
  days: DayPlan[]
}

// ---- helpers ---------------------------------------------------------------

const kcalFromMacros = (m: Macros) => ({
  Protein: m.protein * 4,
  Carbs: m.carbs * 4,
  Fat: m.fat * 9,
})

const toPieData = (m: Macros) => {
  const kcal = kcalFromMacros(m)
  return Object.entries(kcal).map(([name, value]) => ({ name, value }))
}

const COLORS = ["#60a5fa", "#34d399", "#fbbf24"] // azul, verde, amarelo suaves

const formatPct = (value: number, total: number) =>
  total > 0 ? `${Math.round((value / total) * 100)}%` : "0%"

const friendlyDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  })

// ---- UI pieces -------------------------------------------------------------

function MacroPie({ macros, height = 220 }: { macros: Macros; height?: number }) {
  const data = toPieData(macros)
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
            {data.map((entry, index) => (
              <Cell key={`slice-${entry.name}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: ValueType, n: NameType) => [`${v} kcal (${formatPct(Number(v), total)})`, n]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 grid grid-cols-3 text-xs text-muted-foreground">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1">
            <span
              className="inline-block h-2 w-2 rounded"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MealCard({ meal }: { meal: Meal }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{meal.name}</CardTitle>
        <p className="text-xs text-muted-foreground">{meal.description}</p>
      </CardHeader>
      <CardContent className="grid gap-3">
        <MacroPie macros={meal.macros} />
        <div className="text-sm">
          <div className="font-medium mb-1">Informações</div>
          <div className="grid grid-cols-3 gap-2 text-muted-foreground">
            <div><span className="font-semibold text-foreground">{meal.calories}</span> kcal</div>
            <div>P: {meal.macros.protein} g</div>
            <div>C: {meal.macros.carbs} g</div>
            <div>G: {meal.macros.fat} g</div>
          </div>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-1">Ingredientes</div>
          <ul className="list-disc pl-5 space-y-0.5">
            {meal.ingredients.map((ing) => (
              <li key={ing} className="text-muted-foreground">{ing}</li>
            ))}
          </ul>
        </div>
        {meal.recipeUrl && (
          <a
            href={meal.recipeUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm underline text-primary"
          >
            Ver receita
          </a>
        )}
      </CardContent>
    </Card>
  )
}

function DaySummary({ day }: { day: DayPlan }) {
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

// ---- main component --------------------------------------------------------

export function NutritionWeekTabs({ plan }: { plan: WeekPlan }) {
  const firstDay = plan.days[0]?.date ?? "Dia 1"

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

          {/* Lista de compras opcional */}
          {!!d.groceries?.length && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Lista de compras</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-sm text-muted-foreground grid grid-cols-2 md:grid-cols-3 gap-y-1">
                  {d.groceries.map((g) => <li key={g}>{g}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
