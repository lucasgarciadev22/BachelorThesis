namespace AiNutritionApp.Contracts;
public record MacroDto
{
    public int Protein { get; init; }
    public int Carbs { get; init; }
    public int Fat { get; init; }
}
