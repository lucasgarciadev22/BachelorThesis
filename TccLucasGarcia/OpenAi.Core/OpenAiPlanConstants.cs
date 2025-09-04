using OpenAI.Chat;

namespace OpenAi.Core;
public static class OpenAiPlanConstants
{
    // system prompt estático
    public const string SystemPrompt =
        "Você é um assistente de nutrição. Gere um plano semanal (7 dias).";

    // schema estático (pode extrair para arquivo .json se preferir)
    private static readonly string WeeklyPlanSchema = """
    {
      "type": "object",
      "properties": {
        "weekStart": { "type": "string", "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },
        "days": {
          "type": "array",
          "minItems": 7,
          "maxItems": 7,
          "items": {
            "type": "object",
            "properties": {
              "date": { "type": "string", "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },
              "totalCalories": { "type": "integer", "minimum": 0 },
              "macros": {
                "type": "object",
                "properties": {
                  "protein": { "type": "integer", "minimum": 0 },
                  "carbs":   { "type": "integer", "minimum": 0 },
                  "fat":     { "type": "integer", "minimum": 0 }
                },
                "required": ["protein", "carbs", "fat"],
                "additionalProperties": false
              },
              "meals": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "type": "object",
                  "properties": {
                    "name":        { "type": "string" },
                    "description": { "type": "string" },
                    "calories":    { "type": "integer", "minimum": 0 },
                    "macros": {
                      "type": "object",
                      "properties": {
                        "protein": { "type": "integer", "minimum": 0 },
                        "carbs":   { "type": "integer", "minimum": 0 },
                        "fat":     { "type": "integer", "minimum": 0 }
                      },
                      "required": ["protein", "carbs", "fat"],
                      "additionalProperties": false
                    },
                    "ingredients": { "type": "array", "items": { "type": "string" } },
                    "recipeUrl":   { "type": ["string", "null"] }
                  },
                  "required": ["name", "description", "calories", "macros", "ingredients"],
                  "additionalProperties": false
                }
              },
              "groceries": { "type": "array", "items": { "type": "string" } }
            },
            "required": ["date", "totalCalories", "macros", "meals", "groceries"],
            "additionalProperties": false
          }
        }
      },
      "required": ["weekStart", "days"],
      "additionalProperties": false
    }
    """;

    // response format estático (monta BinaryData só 1x)
    public static readonly ChatResponseFormat WeeklyPlanResponseFormat =
        ChatResponseFormat.CreateJsonSchemaFormat(
            jsonSchemaFormatName: "weekly_plan",
            jsonSchema: BinaryData.FromString(WeeklyPlanSchema),
            jsonSchemaIsStrict: true
        );
}