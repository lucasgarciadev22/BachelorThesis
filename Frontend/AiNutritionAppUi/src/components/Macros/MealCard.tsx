import type { Meal } from "@/types/nutrition";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import MacroPie from "./MacroPie";
import { Link, Utensils } from "lucide-react";

export default function MealCard({ meal }: { meal: Meal }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{meal.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{meal.description}</p>
      </CardHeader>
      <CardContent className="grid gap-8">
        <MacroPie macros={meal.macros} />
        <div className="text-sm">
          <div className="font-medium mb-2 mt-8">Informações</div>
          <div className="grid grid-cols-4 gap-1 text-muted-foreground justify-items-start">
            <p className="font-semibold text-foreground">
              {meal.calories} kcal
            </p>
            <p>P: {meal.macros.protein} g</p>
            <p>C: {meal.macros.carbs} g</p>
            <p>G: {meal.macros.fat} g</p>
          </div>
        </div>
        <div className="text-sm justify-self-start">
          <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
            <Utensils className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Ingredientes</span>
          </div>
          <ul className="list-disc pl-5 space-y-0.5 justify-items-start">
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
            className="inline-flex items-center gap-1 text-sm font-medium text-purple-500 hover:underline"
          >
            <Link className="h-4 w-4 " aria-hidden="true" />
            Ver receita
          </a>
        )}
      </CardContent>
    </Card>
  );
}
