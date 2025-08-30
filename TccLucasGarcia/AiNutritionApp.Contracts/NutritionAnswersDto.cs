namespace AiNutritionApp.Contracts;

public record NutritionAnswersDto
{
    public string Goal { get; init; } = string.Empty;
    public string[] Preferences { get; init; } = [];
    public string[] Dislikes { get; init; } = [];
    public string[] Allergies { get; init; } = [];
    public string DietaryPattern { get; init; } = string.Empty;
    public int MealsPerDay { get; init; }
    public int? TargetCalories { get; init; }
    public string Budget { get; init; } = string.Empty;
    public string CookingSkill { get; init; } = string.Empty;
    public string TimePerMeal { get; init; } = string.Empty;
}
