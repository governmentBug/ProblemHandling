using System.Text.Json;

namespace GovernmentBug.Application.Common.Services;

public static class SynonymProvider
{
    private static Dictionary<string, List<string>>? _synonyms;

    public static Dictionary<string, List<string>> Synonyms
    {
        get
        {
            if (_synonyms == null)
            {
                var json = File.ReadAllText("synonym.json");
                _synonyms = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(json)
                            ?? new Dictionary<string, List<string>>();
            }
            return _synonyms;
        }
    }

    public static string NormalizeWord(string word)
    {
        foreach (var pair in Synonyms)
        {
            if (pair.Key == word || pair.Value.Contains(word))
                return pair.Key;
        }
        return word;
    }
}
