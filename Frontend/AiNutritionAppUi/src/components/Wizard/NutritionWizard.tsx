import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { NutritionPrefs } from "@/types/nutrition"
import { toast } from "sonner"

const Schema = z.object({
  goal: z.enum(["cutting", "maintenance", "bulking"]),
  preferences: z.string().optional(),
  dislikes: z.string().optional(),
  allergies: z.string().optional(),
  dietaryPattern: z.enum(["onívoro", "vegetariano", "vegano", "pescetariano", "outro"]),
  mealsPerDay: z.number().min(1).max(8),
  targetCalories: z.number().min(800).max(6000),
  budget: z.enum(["baixo", "médio", "alto"]),
  cookingSkill: z.enum(["básico", "intermediário", "avançado"]),
  timePerMeal: z.enum(["curto", "médio", "longo"]),
})

type FormValues = z.infer<typeof Schema>

export function NutritionWizard({ onSubmit }: { onSubmit: (prefs: NutritionPrefs) => void }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      goal: "maintenance",
      dietaryPattern: "onívoro",
      mealsPerDay: 4,
      targetCalories: 2200,
      budget: "médio",
      cookingSkill: "básico",
      timePerMeal: "curto",
      preferences: "",
      dislikes: "",
      allergies: "",
    },
  })

  const handleSubmit = (values: FormValues) => {
    toast("Gerando plano…", { description: "Isso leva só alguns segundos." })
    onSubmit({
      ...values,
      preferences: values.preferences
        ? values.preferences.split(",").map(s => s.trim()).filter(Boolean)
        : [],
      dislikes: values.dislikes
        ? values.dislikes.split(",").map(s => s.trim()).filter(Boolean)
        : [],
      allergies: values.allergies
        ? values.allergies.split(",").map(s => s.trim()).filter(Boolean)
        : [],
    })
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Objetivo</Label>
          <Select defaultValue={form.getValues("goal")} onValueChange={(v) => form.setValue("goal", v as "cutting" | "maintenance" | "bulking")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cutting">Cutting</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
              <SelectItem value="bulking">Bulking</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Padrão alimentar</Label>
          <Select defaultValue={form.getValues("dietaryPattern")} onValueChange={(v) => form.setValue("dietaryPattern", v as "onívoro" | "vegetariano" | "vegano" | "pescetariano" | "outro")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="onívoro">Onívoro</SelectItem>
              <SelectItem value="vegetariano">Vegetariano</SelectItem>
              <SelectItem value="vegano">Vegano</SelectItem>
              <SelectItem value="pescetariano">Pescetariano</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Refeições por dia</Label>
          <Input type="number" {...form.register("mealsPerDay")} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Calorias alvo</Label>
          <Input type="number" {...form.register("targetCalories")} />
        </div>

        <div>
          <Label>Orçamento</Label>
          <Select defaultValue={form.getValues("budget")} onValueChange={(v) => form.setValue("budget", v as "baixo" | "médio" | "alto")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="baixo">Baixo</SelectItem>
              <SelectItem value="médio">Médio</SelectItem>
              <SelectItem value="alto">Alto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Habilidade culinária</Label>
          <Select defaultValue={form.getValues("cookingSkill")} onValueChange={(v) => form.setValue("cookingSkill", v as "básico" | "intermediário" | "avançado")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="básico">Básico</SelectItem>
              <SelectItem value="intermediário">Intermediário</SelectItem>
              <SelectItem value="avançado">Avançado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Tempo por refeição</Label>
          <Select defaultValue={form.getValues("timePerMeal")} onValueChange={(v) => form.setValue("timePerMeal", v as "curto" | "médio" | "longo")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="curto">Curto</SelectItem>
              <SelectItem value="médio">Médio</SelectItem>
              <SelectItem value="longo">Longo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2" />
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Label>Preferências (separe por vírgula)</Label>
          <Textarea placeholder="frango, arroz, abacate" {...form.register("preferences")} />
        </div>
        <div className="md:col-span-1">
          <Label>Desgostos (separe por vírgula)</Label>
          <Textarea placeholder="peixe, ..." {...form.register("dislikes")} />
        </div>
        <div className="md:col-span-1">
          <Label>Alergias (separe por vírgula)</Label>
          <Textarea placeholder="lactose, ..." {...form.register("allergies")} />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="submit">Gerar plano</Button>
      </div>
    </form>
  )
}
