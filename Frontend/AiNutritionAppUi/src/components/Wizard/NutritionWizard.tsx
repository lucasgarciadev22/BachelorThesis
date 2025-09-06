import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { Sparkles, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"
import type { NutritionAnswersDto } from "@/types/nutrition"
import { csvToArray } from "@/lib/utils/format"
import { toastUtils } from "@/lib/utils/toast"

const Schema = z.object({
  goal: z.enum(["cutting", "maintenance", "bulking"]),
  preferences: z.string().optional(),
  dislikes: z.string().optional(),
  allergies: z.string().optional(),
  dietaryPattern: z.enum(["onívoro", "vegetariano", "vegano", "pescetariano", "outro"]),
  mealsPerDay: z.number().refine((v) => Number.isFinite(v), "Obrigatório")
    .int().min(1).max(8),
  targetCalories: z.number().refine((v) => Number.isFinite(v), "Obrigatório")
    .int().min(800).max(6000),
  budget: z.enum(["baixo", "médio", "alto"]),
  cookingSkill: z.enum(["básico", "intermediário", "avançado"]),
  timePerMeal: z.enum(["curto", "médio", "longo"]),
})

type FormValues = z.infer<typeof Schema>

type Props = {
  onSubmit: (prefs: NutritionAnswersDto) => Promise<void> | void
}

const STEP_FIELDS: (keyof FormValues)[][] = [
  ["goal"],
  ["dietaryPattern"],
  ["mealsPerDay", "targetCalories"],
  ["budget", "cookingSkill", "timePerMeal"],
  ["preferences", "dislikes", "allergies"],
]

const PHRASES = [
  "Analisando seus gostos…",
  "Calculando macros ideais…",
  "Preparando receitas deliciosas…",
  "Otimizando custo e praticidade…",
  "Montando sua semana perfeita…",
]



export function NutritionWizard({ onSubmit }: Props) {
  const [step, setStep] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

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
    mode: "onChange",
  })

  const totalSteps = STEP_FIELDS.length

  async function next() {
    const fields = STEP_FIELDS[step]
    const ok = await form.trigger(fields as (keyof FormValues)[], { shouldFocus: false })
    if (ok) setStep((s) => Math.min(s + 1, totalSteps - 1))
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0))
  }

  async function submitAll(values: FormValues) {
    setIsSubmitting(true)

    const id = toastUtils.loading("Gerando plano com IA…", {
      description: PHRASES[0],
      duration: Infinity,
      icon: <Loader2 className="size-4 animate-spin" />,
    })
    let idx = 0
    const interval = setInterval(() => {
      idx = (idx + 1) % PHRASES.length
      toastUtils.message("Gerando plano com IA…", { id, description: PHRASES[idx] })
    }, 3000)

    try {
      const prefs: NutritionAnswersDto = {
        ...values,
        preferences: csvToArray(values.preferences),
        dislikes: csvToArray(values.dislikes),
        allergies: csvToArray(values.allergies),
      }
      await onSubmit(prefs)
      toastUtils.success("Plano pronto!", { id, description: "Seu plano semanal foi gerado com sucesso." })
    } catch (e) {
      toastUtils.error("Erro ao gerar plano", { id, description: String(e) })
    } finally {
      clearInterval(interval)
      setIsSubmitting(false)
    }
  }

  const progressPct = ((step + 1) / totalSteps) * 100

  return (
    <div className="grid gap-6">
      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-muted">
        <motion.div
          className="h-2 rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      {/* Steps */}
      <form
        onSubmit={form.handleSubmit(submitAll)}
        className="grid gap-6"
      >
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-6"
        >
          {step === 0 && (
            <div className="grid gap-2">
              <Label className="text-base">Qual é seu objetivo?</Label>
              <Select
                defaultValue={form.getValues("goal")}
                onValueChange={(v) =>
                  form.setValue("goal", v as FormValues["goal"], { shouldValidate: true })
                }
              >
                <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cutting">Cutting (perder gordura)</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                  <SelectItem value="bulking">Bulking (ganho de massa)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-2">
              <Label className="text-base">Seu padrão alimentar?</Label>
              <Select
                defaultValue={form.getValues("dietaryPattern")}
                onValueChange={(v) =>
                  form.setValue("dietaryPattern", v as FormValues["dietaryPattern"], { shouldValidate: true })
                }
              >
                <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="onívoro">Onívoro</SelectItem>
                  <SelectItem value="vegetariano">Vegetariano</SelectItem>
                  <SelectItem value="vegano">Vegano</SelectItem>
                  <SelectItem value="pescetariano">Pescetariano</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Refeições por dia</Label>
                <Input
                  type="number"
                  min={1}
                  max={8}
                  {...form.register("mealsPerDay", { valueAsNumber: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Calorias alvo</Label>
                <Input
                  type="number"
                  min={800}
                  max={6000}
                  {...form.register("targetCalories", { valueAsNumber: true })}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="grid gap-2">
                <Label>Orçamento</Label>
                <Select
                  defaultValue={form.getValues("budget")}
                  onValueChange={(v) =>
                    form.setValue("budget", v as FormValues["budget"], { shouldValidate: true })
                  }
                >
                  <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixo">Baixo</SelectItem>
                    <SelectItem value="médio">Médio</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Habilidade culinária</Label>
                <Select
                  defaultValue={form.getValues("cookingSkill")}
                  onValueChange={(v) =>
                    form.setValue("cookingSkill", v as FormValues["cookingSkill"], { shouldValidate: true })
                  }
                >
                  <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="básico">Básico</SelectItem>
                    <SelectItem value="intermediário">Intermediário</SelectItem>
                    <SelectItem value="avançado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Tempo por refeição</Label>
                <Select
                  defaultValue={form.getValues("timePerMeal")}
                  onValueChange={(v) =>
                    form.setValue("timePerMeal", v as FormValues["timePerMeal"], { shouldValidate: true })
                  }
                >
                  <SelectTrigger><SelectValue placeholder="Selecione…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="curto">Curto</SelectItem>
                    <SelectItem value="médio">Médio</SelectItem>
                    <SelectItem value="longo">Longo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Preferências (separe por vírgula)</Label>
                  <Textarea placeholder="frango, arroz, abacate" {...form.register("preferences")} />
                </div>
                <div className="grid gap-2">
                  <Label>Desgostos (separe por vírgula)</Label>
                  <Textarea placeholder="peixe, ..." {...form.register("dislikes")} />
                </div>
                <div className="grid gap-2">
                  <Label>Alergias (separe por vírgula)</Label>
                  <Textarea placeholder="lactose, ..." {...form.register("allergies")} />
                </div>
              </div>

              <Separator />

              {/* Summary */}
              <div className="text-sm text-muted-foreground">
                Revise e clique em <span className="font-medium text-foreground">“Gerar com IA”</span> ✨
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={back}
            disabled={step === 0 || isSubmitting}
            className="gap-1"
          >
            <ChevronLeft className="size-4" />
            Voltar
          </Button>

          {step < totalSteps - 1 ? (
            <Button
              type="button"
              onClick={next}
              disabled={isSubmitting}
              className="gap-1"
            >
              Próximo
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <GenerateAiPlanButton disabled={isSubmitting}>
              <Sparkles className="size-4" />
              Gerar com IA
            </GenerateAiPlanButton>
          )}
        </div>
      </form>
    </div>
  )
}

function GenerateAiPlanButton({
  children,
  disabled,
}: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <motion.button
      type="submit"
      disabled={disabled}
      className="relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5
                 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground
                 shadow-lg transition active:scale-[0.98] disabled:opacity-60"
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Glow animation */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl bg-white/10"
        initial={{ opacity: 0.2 }}
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      />
      {/* Sparkles animation */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-2xl"
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.2 }}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
          maskImage:
            "radial-gradient(14px 14px at 50% 50%, black 60%, transparent 61%)",
          WebkitMaskImage:
            "radial-gradient(14px 14px at 50% 50%, black 60%, transparent 61%)",
        }}
      />
      <span className="relative z-[1] flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}
