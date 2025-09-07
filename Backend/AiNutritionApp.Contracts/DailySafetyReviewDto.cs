namespace AiNutritionApp.Contracts;

public record DailySafetyReviewDto
{
    public string[] AllergensPresent { get; init; } = [];
    public string[] ReplacementsApplied { get; init; } = [];
    public string[] Warnings { get; init; } = [];
}
