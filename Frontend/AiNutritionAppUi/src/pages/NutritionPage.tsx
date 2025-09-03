import * as React from "react"
import  type { WeekPlan, NutritionPrefs } from "@/types/nutrition"
import { generatePlan } from "@/api/aiNutritionServices"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { NutritionWizard } from "@/components/Wizard/NutritionWizard"
import { toast } from "sonner"
import { NutritionWeekTabs } from "@/components/NutritionPlan/NutritionWeekTabs"

export default function NutritionPage() {
  const [loading, setLoading] = React.useState(false)
  const [plan, setPlan] = React.useState<WeekPlan | null>(null)

  const handleGenerate = async (prefs: NutritionPrefs) => {
    try {
      setLoading(true)
      const result = await generatePlan(prefs)
      setPlan(result)
      toast( "Plano pronto!",{ description: "Seu plano semanal foi gerado com sucesso." })
    } catch (e) {
      toast("Erro ao gerar plano",{ description: String(e) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Seu plano nutricional</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <NutritionWizard onSubmit={handleGenerate} />
        </CardContent>
      </Card>

      <Separator />

      {loading && (
        <Card>
          <CardHeader><CardTitle>Gerando plano…</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {!loading && plan && (
        <Card>
          <CardHeader><CardTitle>Semana {new Date(plan.weekStart).toLocaleDateString("pt-BR")}</CardTitle></CardHeader>
          <CardContent className="p-2">
            <NutritionWeekTabs plan={plan} />
          </CardContent>
        </Card>
      )}

      {!loading && !plan && (
        <Card>
          <CardHeader><CardTitle>Nenhum plano ainda</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground">
            Preencha o formulário acima e clique em “Gerar plano”.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
