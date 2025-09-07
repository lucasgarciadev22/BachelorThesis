import * as React from "react";
import type { WeeklyPlanDto, NutritionAnswersDto } from "@/types/nutrition";
import { generatePlan } from "@/api/aiNutritionServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { NutritionWizard } from "@/components/Wizard/NutritionWizard";
import { toastUtils } from "@/lib/utils/toast";
import { NutritionWeekTabs } from "@/components/NutritionPlan/NutritionWeekTabs";

export default function WizardPage() {
  const [loading, setLoading] = React.useState(false);
  const [plan, setPlan] = React.useState<WeeklyPlanDto | null>(null);

  const handleGenerate = async (prefs: NutritionAnswersDto) => {
    try {
      setLoading(true);
      const result: WeeklyPlanDto = await generatePlan(prefs);
      setPlan(result);
      toastUtils.success("Plano pronto!", {
        description: "Seu plano semanal foi gerado com sucesso.",
        duration: 3000,
      });
    } catch (e) {
      toastUtils.error("Erro ao gerar plano", { description: String(e) });
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Siga o quiz para gerar seu plano nutricional semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <NutritionWizard onSubmit={handleGenerate} />
        </CardContent>
      </Card>

      {loading || plan ? <Separator /> : null}

      {loading && (
        <Card>
          <CardHeader>
            <CardTitle>Gerando plano…</CardTitle>
          </CardHeader>
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
          <CardHeader>
            <CardTitle>
              Semana {new Date(plan.days[1].date).toLocaleDateString("pt-BR")} -
              {new Date(
                plan.days[plan.days.length - 1].date,
              ).toLocaleDateString("pt-BR")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <NutritionWeekTabs plan={plan} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
