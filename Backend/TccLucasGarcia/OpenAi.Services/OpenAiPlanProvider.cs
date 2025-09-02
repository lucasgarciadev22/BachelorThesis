using AiNutritionApp.Application.Abstractions;
using AiNutritionApp.Contracts;
using OpenAi.Core;
using OpenAI.Chat;
using System.Text.Json;

namespace OpenAi.Application;

public sealed class OpenAiPlanProvider(ChatClient chat) : INutritionPlanProvider
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task<WeeklyPlanDto> GenerateAsync(NutritionAnswersDto answers, CancellationToken ct)
    {
        // opções por requisição, mas reusando o ResponseFormat estático
        var opts = new ChatCompletionOptions
        {
            ResponseFormat = OpenAiPlanConstants.WeeklyPlanResponseFormat
        };

        // mensagem do usuário ainda é específica por requisição (dados variam)
        var user = $"""
          Preferências: {string.Join(", ", answers.Preferences ?? [])}
          Rejeições: {string.Join(", ", answers.Dislikes ?? [])}
          Alergias: {string.Join(", ", answers.Allergies ?? [])}
          Padrão alimentar: {answers.DietaryPattern}
          Objetivo: {answers.Goal}
          Refeições/dia: {answers.MealsPerDay}
          Calorias alvo: {(answers.TargetCalories?.ToString() ?? "n/i")}
          Orçamento: {answers.Budget}
          Habilidade: {answers.CookingSkill}
          Tempo/refeição: {answers.TimePerMeal}
        """;

        var completion = await chat.CompleteChatAsync(
            [ new SystemChatMessage(OpenAiPlanConstants.SystemPrompt),
              new UserChatMessage(user) ],
            opts, ct);

        var json = completion.Value.Content[0].Text;
        return JsonSerializer.Deserialize<WeeklyPlanDto>(json, JsonOpts)!;
    }
}
