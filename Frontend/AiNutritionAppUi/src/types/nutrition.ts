export type Macros = { protein: number; carbs: number; fat: number }

export type Meal = {
  name: string
  description: string
  calories: number
  macros: Macros
  ingredients: string[]
  recipeUrl?: string | null
}

export type DayPlan = {
  date: string
  totalCalories: number
  macros: Macros
  meals: Meal[]
  groceries: string[]
}

export type WeekPlan = {
  weekStart: string
  days: DayPlan[]
}

// Payload do wizard
export type NutritionPrefs = {
  goal: "cutting" | "maintenance" | "bulking"
  preferences: string[]         // likes
  dislikes: string[]
  allergies: string[]
  dietaryPattern: "onívoro" | "vegetariano" | "vegano" | "pescetariano" | "outro"
  mealsPerDay: number
  targetCalories: number
  budget: "baixo" | "médio" | "alto"
  cookingSkill: "básico" | "intermediário" | "avançado"
  timePerMeal: "curto" | "médio" | "longo"
}
