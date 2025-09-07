namespace AiNutritionApp.Contracts;

public record WeeklyPlanDto
{
    public string WeekStart { get; init; } = string.Empty;
    public DayPlanDto[] Days { get; init; } = [];
    public WeeklySafetyReviewDto SafetyReview { get; init; } = new();
}