using AiNutritionApp.Contracts;

namespace AiNutritionApp.Application.Providers;

public interface INutritionPlanProvider
{
    Task<WeeklyPlanDto> GenerateAsync(NutritionAnswersDto input, CancellationToken ct);
}
