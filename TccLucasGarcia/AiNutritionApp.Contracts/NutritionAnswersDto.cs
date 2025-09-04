using System.ComponentModel.DataAnnotations;

namespace AiNutritionApp.Contracts;

public record NutritionAnswersDto
{
    [Required]
    public string Goal { get; init; } = string.Empty;

    public string[] Preferences { get; init; } = [];
    public string[] Dislikes { get; init; } = [];
    public string[] Allergies { get; init; } = [];

    [Required]
    public string DietaryPattern { get; init; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int MealsPerDay { get; init; }

    public int? TargetCalories { get; init; }

    [Required]
    public string Budget { get; init; } = string.Empty;

    [Required]
    public string CookingSkill { get; init; } = string.Empty;

    [Required]
    public string TimePerMeal { get; init; } = string.Empty;
}
