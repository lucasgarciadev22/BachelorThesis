import type { NutritionAnswersDto, WeeklyPlanDto } from "@/types/nutrition";

const BASE_URL = import.meta.env.DEV ? import.meta.env.VITE_NUTRITION_API : "";

async function readProblem(res: Response) {
  try {
    const data = await res.json();
    const title = data.title ?? "Erro de solicitação";
    const detail = data.detail ?? data.message ?? "";
    const errors =
      data.errors && typeof data.errors === "object"
        ? Object.entries(data.errors)
            .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
            .join(" | ")
        : "";
    const msg = [title, detail, errors].filter(Boolean).join(" — ");
    return msg || `HTTP ${res.status} ${res.statusText}`;
  } catch {
    try {
      const text = await res.text();
      return text || `HTTP ${res.status} ${res.statusText}`;
    } catch {
      return `HTTP ${res.status} ${res.statusText}`;
    }
  }
}

export async function generatePlan(
  prefs: NutritionAnswersDto,
  opts?: { signal?: AbortSignal; timeoutMs?: number; validate?: boolean },
): Promise<WeeklyPlanDto> {
  const timeoutMs = opts?.timeoutMs ?? 300000;
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), timeoutMs);
  const signal = opts?.signal
    ? typeof AbortSignal.any === "function"
      ? AbortSignal.any([opts.signal, controller.signal])
      : controller.signal
    : controller.signal;

  try {
    const res = await fetch(`${BASE_URL}/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(prefs),
      signal,
    });

    if (!res.ok) {
      throw new Error(await readProblem(res));
    }

    const data = (await res.json()) as WeeklyPlanDto;

    // if (opts?.validate !== false) {
    //   const parsed = WeekPlanSchema.safeParse(data)
    //   if (!parsed.success) {
    //     const issues = parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(" | ")
    //     throw new Error(`Resposta inválida do servidor: ${issues}`)
    //   }
    // }

    return data as WeeklyPlanDto;
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      (err as { name?: string }).name === "AbortError"
    ) {
      throw new Error("Tempo de requisição esgotado (timeout).");
    }
    throw err instanceof Error ? err : new Error(String(err));
  } finally {
    clearTimeout(to);
  }
}
