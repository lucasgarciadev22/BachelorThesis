namespace AiNutritionApp.Contracts;
public record MealDto
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public int Calories { get; init; }
    public MacroDto Macros { get; init; } = new();
    public string[] Ingredients { get; init; } = [];
    public string? RecipeUrl { get; init; }
}

