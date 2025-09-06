import z from "zod";

export const WizardSchema = z.object({
  goal: z.enum(["cutting", "maintenance", "bulking"]),
  preferences: z.string().optional(),
  dislikes: z.string().optional(),
  allergies: z.string().optional(),
  dietaryPattern: z.enum([
    "onívoro",
    "vegetariano",
    "vegano",
    "pescetariano",
    "outro",
  ]),
  mealsPerDay: z
    .number()
    .refine((v) => Number.isFinite(v), "Obrigatório")
    .int()
    .min(1)
    .max(8),
  targetCalories: z
    .number()
    .refine((v) => Number.isFinite(v), "Obrigatório")
    .int()
    .min(800)
    .max(6000),
  budget: z.enum(["baixo", "médio", "alto"]),
  cookingSkill: z.enum(["básico", "intermediário", "avançado"]),
  timePerMeal: z.enum(["curto", "médio", "longo"]),
});

export type FormValues = z.infer<typeof WizardSchema>;
