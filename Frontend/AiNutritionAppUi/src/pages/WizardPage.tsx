import * as React from "react"
import { useNavigate } from "react-router-dom"
import type { WeeklyPlanDto, NutritionAnswersDto } from "@/types/nutrition"
import { generatePlan } from "@/api/aiNutritionServices"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { NutritionWizard } from "@/components/Wizard/NutritionWizard"
import { usePlan } from "@/hooks/usePlan"
import { toastUtils } from "@/lib/utils/toast"

export default function WizardPage() {
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()
  const { setPlan } = usePlan()

  const handleGenerate = async (prefs: NutritionAnswersDto) => {
    try {
      setLoading(true)
      const result: WeeklyPlanDto = await generatePlan(prefs)
      setPlan(result)
      toastUtils.success("Plano pronto!", { description: "Seu plano semanal foi gerado com sucesso.", duration:3000 })
      navigate("/result")
    } catch (e) {
      toastUtils.error("Erro ao gerar plano", { description: String(e) })
      throw e 
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
    </div>
  )
}
