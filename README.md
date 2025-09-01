# TCC

## Configuring OpenAI

The API requires an OpenAI API key. Provide it via [user secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets) or environment variables.

### User secrets
```bash
cd TccLucasGarcia/AiNutritionApp.Api
dotnet user-secrets init
dotnet user-secrets set "OpenAI:ApiKey" "sk-your-key"
```

### Environment variables
```bash
export OpenAI__ApiKey="sk-your-key"
# optional model override
export OpenAI__Model="gpt-4o-mini"
```
`OpenAI__Model` overrides the model configured in *appsettings.json*.

## Calling the endpoint

A POST endpoint generates a weekly nutrition plan. Try it via Swagger at `https://localhost:5001/swagger` or with `curl`:

```bash
curl -X POST "https://localhost:5001/weekly-plan" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "gain muscle",
    "preferences": ["chicken"],
    "dislikes": [],
    "allergies": [],
    "dietaryPattern": "omnivore",
    "mealsPerDay": 3,
    "targetCalories": 2500,
    "budget": "medium",
    "cookingSkill": "intermediate",
    "timePerMeal": "30m"
  }'
```
The response is a `WeeklyPlanDto` JSON document.
