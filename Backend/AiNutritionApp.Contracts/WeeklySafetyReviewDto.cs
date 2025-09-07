namespace AiNutritionApp.Contracts;

/// <summary>
/// This record captures the safety review details of a nutrition plan. It includes information about allergens checked, any conflicts found, and additional notes.
/// </summary>
public record WeeklySafetyReviewDto
{
    public string[] CheckedAllergens { get; init; } = [];
    public string[] ConflictsFound { get; init; } = [];
    public string Notes { get; init; } = string.Empty;
}
