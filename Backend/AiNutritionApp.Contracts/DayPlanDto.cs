namespace AiNutritionApp.Contracts;
public record DayPlanDto
{
    public string Date { get; init; } = string.Empty;
    public int TotalCalories { get; init; }
    public MacroDto Macros { get; init; } = new();
    public MealDto[] Meals { get; init; } = [];
    public string[] Groceries { get; init; } = [];
    public DailySafetyReviewDto SafetyReview { get; init; } = new();
}
