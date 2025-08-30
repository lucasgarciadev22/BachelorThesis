using AiNutritionApp.Contracts;

namespace AiNutritionApp.Application.Abstractions;

public interface INutritionPlanProvider
{
    Task<WeeklyPlanDto> GenerateAsync(NutritionAnswersDto input, CancellationToken ct);
}
