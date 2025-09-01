using AiNutritionApp.Application.Abstractions;
using AiNutritionApp.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Logging;
using OpenAi.Application;
using System.ComponentModel.DataAnnotations;

var builder = WebApplication.CreateBuilder(args);

// 3.1 Bind da seção "OpenAI" do appsettings / env vars → OpenAiSettings
builder.Services.Configure<OpenAiSettings>(builder.Configuration.GetSection("OpenAI"));
// Observação: env vars com nome "OpenAI__ApiKey" e "OpenAI__Model" sobrescrevem appsettings. :contentReference[oaicite:2]{index=2}

// 3.2 Registra o provedor (lê IOptions<OpenAiSettings> internamente)
builder.Services.AddOpenAiNutritionProvider();

var app = builder.Build();

app.MapPost("/plans",
    async Task<Results<Ok<WeeklyPlanDto>, ValidationProblem, ProblemHttpResult>> (
        NutritionAnswersDto dto,
        INutritionPlanProvider provider,
        ILogger<Program> logger,
        CancellationToken ct) =>
    {
        var validationContext = new ValidationContext(dto);
        var validationResults = new List<ValidationResult>();

        if (!Validator.TryValidateObject(dto, validationContext, validationResults, true))
        {
            var errors = validationResults
                .GroupBy(r => r.MemberNames.FirstOrDefault() ?? string.Empty)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(r => r.ErrorMessage ?? string.Empty).ToArray());

            return TypedResults.ValidationProblem(errors);
        }

        try
        {
            var plan = await provider.GenerateAsync(dto, ct);
            return TypedResults.Ok(plan);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error generating nutrition plan");
            return TypedResults.Problem("Failed to generate plan.", statusCode: StatusCodes.Status500InternalServerError);
        }
    });

app.Run();
