using AiNutritionApp.Application.Abstractions;
using AiNutritionApp.Contracts;
using OpenAi.Core;
using OpenAI.Chat;
using System.Text.Json;

namespace OpenAi.Application;

public sealed class OpenAiPlanProvider(ChatClient chat) : INutritionPlanProvider
{
    public async Task<WeeklyPlanDto> GenerateAsync(NutritionAnswersDto a, CancellationToken ct)
    {
        // opções por requisição, mas reusando o ResponseFormat estático
        var opts = new ChatCompletionOptions
        {
            ResponseFormat = OpenAiPlanConstants.WeeklyPlanResponseFormat
        };

        // mensagem do usuário ainda é específica por requisição (dados variam)
        var user = $"""
          Preferências: {string.Join(", ", a.Preferences ?? [])}
          Rejeições: {string.Join(", ", a.Dislikes ?? [])}
          Alergias: {string.Join(", ", a.Allergies ?? [])}
          Padrão alimentar: {a.DietaryPattern}
          Objetivo: {a.Goal}
          Refeições/dia: {a.MealsPerDay}
          Calorias alvo: {(a.TargetCalories?.ToString() ?? "n/i")}
          Orçamento: {a.Budget}
          Habilidade: {a.CookingSkill}
          Tempo/refeição: {a.TimePerMeal}
        """;

        var completion = await chat.CompleteChatAsync(
            [ new SystemChatMessage(OpenAiPlanConstants.SystemPrompt),
              new UserChatMessage(user) ],
            opts, ct);

        var json = completion.Value.Content[0].Text;
        return JsonSerializer.Deserialize<WeeklyPlanDto>(json)!;
    }
}
