export type Macros = { protein: number; carbs: number; fat: number };

export type Meal = {
  name: string;
  description: string;
  calories: number;
  macros: Macros;
  ingredients: string[];
  recipeUrl?: string | null;
};

export type DayPlan = {
  date: string;
  totalCalories: number;
  macros: Macros;
  meals: Meal[];
  groceries: string[];
  safetyReview: DailySafetyReviewDto;
};

export interface WeeklyPlanDto {
  weekStart: string;
  days: DayPlan[];
  safetyReview: WeeklySafetyReviewDto;
}

export interface NutritionAnswersDto {
  goal: "cutting" | "maintenance" | "bulking";
  preferences: string[];
  dislikes: string[];
  allergies: string[];
  dietaryPattern:
    | "onívoro"
    | "vegetariano"
    | "vegano"
    | "pescetariano"
    | "outro";
  mealsPerDay: number;
  targetCalories: number;
  budget: "baixo" | "médio" | "alto";
  cookingSkill: "básico" | "intermediário" | "avançado";
  timePerMeal: "curto" | "médio" | "longo";
}

export interface WeeklySafetyReviewDto {
  checkedAllergens: string[];
  conflictsFound: string[];
  notes: string;
}

export interface DailySafetyReviewDto {
  allergensPresent: string[];
  replacementsApplied: string[];
  warnings: string[];
}
