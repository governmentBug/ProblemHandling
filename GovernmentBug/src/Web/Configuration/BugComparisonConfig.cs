using GovernmentBug.Application.Common.Interfaces;
using Microsoft.Extensions.Options;

namespace GovernmentBug.Web.Configuration;

public class BugComparisonConfig : IBugComparisonConfig
{
    private readonly BugComparisonSettings _settings;
    public BugComparisonConfig(IOptions<BugComparisonSettings> settings)
    {
        _settings = settings.Value;
    }
    public int FuzzyMatchThreshold => _settings.FuzzyMatchThreshold;
}

