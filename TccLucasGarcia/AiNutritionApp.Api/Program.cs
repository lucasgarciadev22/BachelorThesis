// AiNutritionApp.Api/Program.cs
using OpenAi.Application;

var builder = WebApplication.CreateBuilder(args);

// 3.1 Bind da seção "OpenAI" do appsettings / env vars → OpenAiSettings
builder.Services.Configure<OpenAiSettings>(builder.Configuration.GetSection("OpenAI"));
// Observação: env vars com nome "OpenAI__ApiKey" e "OpenAI__Model" sobrescrevem appsettings. :contentReference[oaicite:2]{index=2}

// 3.2 Registra o provedor (lê IOptions<OpenAiSettings> internamente)
builder.Services.AddOpenAiNutritionProvider();

var app = builder.Build();
app.Run();
