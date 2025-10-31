using AiNutritionApp.Application.Providers;
using AiNutritionApp.Contracts;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.OpenApi.Models;
using OpenAi.Application;
using System.ComponentModel.DataAnnotations;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<OpenAiSettings>(builder.Configuration.GetSection("OpenAI"));
builder.Services.AddOpenAiNutritionProvider();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => c.SwaggerDoc("v1", new OpenApiInfo
{
    Title = "Ai Nutrition App API - Bachelor Thesis by Lucas Garcia",
    Version = "v1",
    Description = "Generates weekly nutritional plan via OpenAI API"
}));
builder.Services.AddCors(options => options.AddPolicy("DevCors", p =>
        p.WithOrigins("http://localhost:8082")
         .AllowAnyHeader()
         .AllowAnyMethod()
    ));

WebApplication app = builder.Build();

app.UseCors("DevCors");

if (app.Environment.IsDevelopment())
{
    _ = app.UseSwagger();
    _ = app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Ai Nutrition App API - Bachelor Thesis by Lucas Garcia");
        c.DocumentTitle = "Ai Nutrition App API - Bachelor Thesis by Lucas Garcia – Swagger";
        c.DisplayRequestDuration();
    });
}


//Configures a minimal API endpoint to generate a weekly nutrition plan based on user inputs.
app.MapPost("api/plans",
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
            WeeklyPlanDto plan = await provider.GenerateAsync(dto, ct);
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
