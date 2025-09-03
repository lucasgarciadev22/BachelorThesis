using AiNutritionApp.Application.Abstractions;
using AiNutritionApp.Contracts;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.OpenApi.Models;
using OpenAi.Application;
using System.ComponentModel.DataAnnotations;

var builder = WebApplication.CreateBuilder(args);

// OpenAI settings via Options (env/appsettings)
builder.Services.Configure<OpenAiSettings>(builder.Configuration.GetSection("OpenAI"));

// OpenAI provider (ChatClient + INutritionPlanProvider)
builder.Services.AddOpenAiNutritionProvider();

// ===== Swagger / OpenAPI =====
builder.Services.AddEndpointsApiExplorer(); // necessário para Minimal APIs
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AiNutrition API",
        Version = "v1",
        Description = "Gera plano semanal de nutrição via OpenAI (JSON estruturado)."
    });
});
// ============================

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", p =>
        p.WithOrigins("http://localhost:5173")   // exact origin of your Vite dev server
         .AllowAnyHeader()                       // allows Content-Type: application/json
         .AllowAnyMethod()                       // allows POST, OPTIONS, etc.
                                                 // .AllowCredentials()                  // only if you use cookies/authorization header
    );
});

var app = builder.Build();

// Habilite Swagger (normalmente apenas em DEV)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AiNutrition API v1");
        c.DocumentTitle = "AiNutrition – Swagger";
        c.DisplayRequestDuration();
    });
}
// (opcional) Em produção, deixe protegido ou desabilite Swagger UI. :contentReference[oaicite:1]{index=1}

app.UseCors("DevCors");

app.MapPost("/plans",
    async Task<Results<Ok<WeeklyPlanDto>, ValidationProblem, ProblemHttpResult>> (
        NutritionAnswersDto dto,
        INutritionPlanProvider provider,
        ILogger<Program> logger,
        CancellationToken ct) =>
    {
        // validação por DataAnnotations (se você anotar o DTO)
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
            return TypedResults.Problem(
                "Failed to generate plan.",
                statusCode: StatusCodes.Status500InternalServerError);
        }
    })
    .WithName("GenerateWeeklyPlan")
    .WithTags("Plans")
    .Produces<WeeklyPlanDto>(StatusCodes.Status200OK)
    .ProducesValidationProblem()
    .ProducesProblem(StatusCodes.Status500InternalServerError);

app.Run();
