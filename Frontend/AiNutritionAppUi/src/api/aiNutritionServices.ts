import type { NutritionPrefs, WeekPlan } from "@/types/nutrition";

const BASE_URL = import.meta.env.VITE_NUTRITION_API ?? "http://localhost:5123"

// Helper para extrair ProblemDetails (ASP.NET Minimal APIs)
async function readProblem(res: Response) {
  try {
    const data = await res.json()
    // Padrão ProblemDetails
    const title = data.title ?? "Erro de solicitação"
    const detail = data.detail ?? data.message ?? ""
    const errors =
      data.errors && typeof data.errors === "object"
        ? Object.entries(data.errors)
            .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
            .join(" | ")
        : ""
    const msg = [title, detail, errors].filter(Boolean).join(" — ")
    return msg || `HTTP ${res.status} ${res.statusText}`
  } catch {
    // fallback para texto cru
    try {
      const text = await res.text()
      return text || `HTTP ${res.status} ${res.statusText}`
    } catch {
      return `HTTP ${res.status} ${res.statusText}`
    }
  }
}

export async function generatePlan(
  prefs: NutritionPrefs,
  opts?: { signal?: AbortSignal; timeoutMs?: number; validate?: boolean }
): Promise<WeekPlan> {
  const timeoutMs = opts?.timeoutMs ?? 120000
  const controller = new AbortController()
  const to = setTimeout(() => controller.abort(), timeoutMs)
  const signal = opts?.signal
    ? typeof AbortSignal.any === "function"
      ? AbortSignal.any([opts.signal, controller.signal])
      : controller.signal
    : controller.signal

  try {
    const res = await fetch(`${BASE_URL}/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(prefs),
      signal,
    })

    if (!res.ok) {
      throw new Error(await readProblem(res))
    }

    const data = (await res.json()) as WeekPlan

    // if (opts?.validate !== false) {
    //   const parsed = WeekPlanSchema.safeParse(data)
    //   if (!parsed.success) {
    //     const issues = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(" | ")
    //     throw new Error(`Resposta inválida do servidor: ${issues}`)
    //   }
    // }

    // compatível com seu tipo WeekPlan
    return data as WeekPlan
  } catch (err: unknown) {
    if (err && typeof err === "object" && (err as { name?: string }).name === "AbortError") {
      throw new Error("Tempo de requisição esgotado (timeout).")
    }
    throw err instanceof Error ? err : new Error(String(err))
  } finally {
    clearTimeout(to)
  }
}