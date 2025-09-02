namespace OpenAi.Application;
public record OpenAiSettings
{
    public string Model { get; init; } = "gpt-4o-mini";
    public string ApiKey { get; init; } = string.Empty;
}
