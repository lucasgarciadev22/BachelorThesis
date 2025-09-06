import { Link, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NutritionWeekTabs } from "@/components/NutritionPlan/NutritionWeekTabs";
import { usePlan } from "@/hooks/usePlan";

export default function ResultPage() {
  const { plan } = usePlan();

  if (!plan) {
    //Return to wizard if no plan is set
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-4 grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Semana {new Date(plan.weekStart).toLocaleDateString("pt-BR")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <NutritionWeekTabs plan={plan} />
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <Link to="/" className="underline underline-offset-4">
          ← Gerar outro plano
        </Link>
      </div>
    </div>
  );
}
