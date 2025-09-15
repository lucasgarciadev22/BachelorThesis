using OpenAI.Chat;

namespace OpenAi.Core;
public static class OpenAiPlanConstants
{
    /// <summary>
    /// Represents the default system prompt used to initialize the nutrition assistant.
    /// </summary>
    /// <remarks>This prompt instructs the assistant to generate a weekly (7-day) nutrition plan. It is
    /// intended to provide context for the assistant's behavior and responses.</remarks>
    public static readonly string SystemPrompt =
    $@"Você é um(a) nutricionista virtual profissional. Suas respostas devem ser:

    • Seguras, baseadas em boas práticas e sem extrapolar seu escopo (não diagnosticar doenças, não prescrever fármacos).
    • Rigorosamente alinhadas às restrições e alergias informadas pelo usuário.
    • Culturalmente adequadas (medidas caseiras/gramas; substituir por itens localmente disponíveis quando necessário).
    • Sempre em JSON conforme o schema fornecido.

    REGRAS DE SEGURANÇA (OBRIGATÓRIAS):
    1) Nunca inclua ingredientes/alimentos de listas de alergias, intolerâncias, restrições médicas, éticas ou religiosas.
    2) Se o usuário pedir explicitamente um item proibido (ex.: “quero amendoim” mesmo sendo alérgico), NEGUE e ofereça alternativas seguras.
    3) Não recomende dietas extremas, protocolos arriscados ou combinações sabidamente contraindicadas.
    4) Se informações essenciais estiverem ausentes (ex.: alergias desconhecidas), aja pelo lado da cautela e use substitutos de baixo risco.
    5) Adote linguagem neutra e educativa, e inclua avisos quando houver incerteza.
    FONTES DE RECEITA (YouTube‑only):
    • Ao preencher recipeUrl, use somente links do YouTube (formatos watch?v=… ou youtu.be/…).
    • Se não houver vídeo válido/atual, gere um link de busca do YouTube no formato:
    https://www.youtube.com/results?search_query=<nome_da_refeição+ingrediente1+ingrediente2>
    (substitua espaços por +; use no máximo 3 ingredientes principais).
    • Nunca invente links de vídeo. Se não conseguir compor a query de forma significativa, deixe recipeUrl como null.

    FORMATO:
    • Gere exclusivamente o JSON do plano semanal conforme o schema.
    • Preencha o bloco safetyReview semanal e diário, indicando também quando um link de busca foi usado em vez de um vídeo (ex.: warnings: [""Sem vídeo válido; usado link de busca""]).
    ";


    /// <summary>
    /// JSON Schema for validating the structure of the weekly nutrition plan response. Chat GPT must strictly adhere to this schema.
    /// </summary>
    private static readonly string WeeklyPlanSchema = """
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "title": "Weekly Nutrition Plan",
      "description": "Seven-day meal plan with macros and groceries.",
      "type": "object",
      "additionalProperties": false,
      "required": ["weekStart", "days", "safetyReview"],
      "properties": {
        "weekStart": { "type": "string", "format": "date", "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" },

        "safetyReview": {
          "type": "object",
          "additionalProperties": false,
          "required": ["checkedAllergens", "conflictsFound", "notes"],
          "properties": {
            "checkedAllergens": { "type": "array", "items": { "type": "string", "minLength": 1 } },
            "conflictsFound": { "type": "array", "items": { "type": "string", "minLength": 1 } },
            "notes": { "type": "string" }
          }
        },

        "days": {
          "type": "array",
          "minItems": 7,
          "maxItems": 7,
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["date", "totalCalories", "macros", "meals", "groceries", "safetyReview"],
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
                      "pattern": "^(https?:\\/\\/)?(www\\.)?(youtube\\.com\\/(watch\\?v=[A-Za-z0-9_-]{11}|results\\?search_query=[^\\s]+)|youtu\\.be\\/[A-Za-z0-9_-]{11})(?:[&?].*)?$"
                    }
                  }
                }
              },
              "groceries": { "type": "array", "items": { "type": "string", "minLength": 1 } },
              "safetyReview": {
                "type": "object",
                "additionalProperties": false,
                "required": ["allergensPresent", "replacementsApplied", "warnings"],
                "properties": {
                  "allergensPresent": { "type": "array", "items": { "type": "string", "minLength": 1 } },
                  "replacementsApplied": { "type": "array", "items": { "type": "string", "minLength": 1 } },
                  "warnings": { "type": "array", "items": { "type": "string", "minLength": 1 } }
                }
              }
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