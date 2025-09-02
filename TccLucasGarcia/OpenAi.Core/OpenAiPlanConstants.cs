using OpenAI.Chat;

namespace OpenAi.Core;
public static class OpenAiPlanConstants
{
    public const string SystemPrompt =
        "Você é um assistente de nutrição. Gere um plano semanal (7 dias).";

    private static readonly string WeeklyPlanSchema = """
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "Weekly Nutrition Plan",
      "description": "Seven-day meal plan with macros and groceries.",
      "type": "object",
      "additionalProperties": false,
      "required": ["weekStart", "days"],
      "properties": {
        "weekStart": { "type": "string", "format": "date", "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },
        "days": {
          "type": "array",
          "minItems": 7,
          "maxItems": 7,
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["date", "totalCalories", "macros", "meals", "groceries"],
            "properties": {
              "date": { "type": "string", "format": "date", "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },
              "totalCalories": { "type": "integer", "minimum": 0 },
              "macros": {
                "type": "object",
                "additionalProperties": false,
                "required": ["protein", "carbs", "fat"],
                "properties": {
                  "protein": { "type": "integer", "minimum": 0 },
                  "carbs":   { "type": "integer", "minimum": 0 },
                  "fat":     { "type": "integer", "minimum": 0 }
                }
              },
              "meals": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "type": "object",
                  "additionalProperties": false,
                  "required": ["name", "description", "calories", "macros", "ingredients", "recipeUrl"],
                  "properties": {
                    "name":        { "type": "string", "minLength": 1 },
                    "description": { "type": "string", "minLength": 1 },
                    "calories":    { "type": "integer", "minimum": 0 },
                    "macros": {
                      "type": "object",
                      "additionalProperties": false,
                      "required": ["protein", "carbs", "fat"],
                      "properties": {
                        "protein": { "type": "integer", "minimum": 0 },
                        "carbs":   { "type": "integer", "minimum": 0 },
                        "fat":     { "type": "integer", "minimum": 0 }
                      }
                    },
                    "ingredients": { "type": "array", "minItems": 1, "items": { "type": "string", "minLength": 1 } },
                    "recipeUrl": {
                      "type": ["string", "null"],
                      "pattern": "^https?://\\S+$"
                    }
                  }
                }
              },
              "groceries": { "type": "array", "items": { "type": "string", "minLength": 1 } }
            }
          }
        }
      }
    }
    """;

    public static readonly ChatResponseFormat WeeklyPlanResponseFormat =
        ChatResponseFormat.CreateJsonSchemaFormat(
            jsonSchemaFormatName: "weekly_plan",
            jsonSchema: BinaryData.FromString(WeeklyPlanSchema),
            jsonSchemaIsStrict: true
        );
}