import type { Meal } from "@/types/nutrition";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import MacroPie from "./MacroPie";

export default function MealCard({ meal }: { meal: Meal }) {
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
            <div>
              <span className="font-semibold text-foreground">
                {meal.calories}
              </span>{" "}
              kcal
            </div>
            <div>P: {meal.macros.protein} g</div>
            <div>C: {meal.macros.carbs} g</div>
            <div>G: {meal.macros.fat} g</div>
          </div>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-1">Ingredientes</div>
          <ul className="list-disc pl-5 space-y-0.5">
            {meal.ingredients.map((ing) => (
              <li key={ing} className="text-muted-foreground">
                {ing}
              </li>
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
  );
}
