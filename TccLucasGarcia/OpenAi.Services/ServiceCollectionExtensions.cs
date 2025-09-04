// OpenAi.Application/ServiceCollectionExtensions.cs
using AiNutritionApp.Application.Abstractions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using OpenAI.Chat;

namespace OpenAi.Application;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddOpenAiNutritionProvider(this IServiceCollection services)
    {
        services.AddSingleton(sp =>
        {
            var s = sp.GetRequiredService<IOptions<OpenAiSettings>>().Value;
            var apiKey = !string.IsNullOrWhiteSpace(s.ApiKey)
                ? s.ApiKey
                : Environment.GetEnvironmentVariable("OPENAI_API_KEY"); // fallback comum

            if (string.IsNullOrWhiteSpace(apiKey))
                throw new InvalidOperationException("API key not configured.");

            return new ChatClient(s.Model, apiKey);
        });

        services.AddScoped<INutritionPlanProvider, OpenAiPlanProvider>();

        return services;
    }
}
