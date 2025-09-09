using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GovernmentBug.Application.Bugs.Queries.GetBugsList;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Entities;
using FuzzySharp;
using Microsoft.EntityFrameworkCore; // Ensure you have this using for EF Core
using GovernmentBug.Application.Common.Models;
using GovernmentBug.Application.Common.Services;

namespace GovernmentBug.Application.Bugs.Queries.BugComparison
{
    public record class BugComparisonQuery() : IRequest<List<BugSummariesDto>>
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<AttachmentsDto> Attachments { get; set; } = new();
        public int? CategoryId { get; set; }
    }

    public class BugComparisonQueryHandler : IRequestHandler<BugComparisonQuery, List<BugSummariesDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IBugComparisonConfig _bugComparisonConfig;
        private readonly IImageComparisonService _imageComparisonService;

        public BugComparisonQueryHandler(IApplicationDbContext context,
            IMapper mapper,
            IBugComparisonConfig bugComparisonConfig,
            IImageComparisonService imageComparisonService)
        {
            _context = context;
            _mapper = mapper;
            _bugComparisonConfig = bugComparisonConfig;
            _imageComparisonService = imageComparisonService;
        }

        private string NormalizeText(string text)
        {
            text = text.ToLowerInvariant();
            var stopWords = new HashSet<string> { "ה", "ו", "ש", "את", "עבור", "על", "ב", "מ", "אתה", "אני", "הם", "היא", "זה" };
            var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries)
                            .Where(word => !stopWords.Contains(word));
            return string.Join(' ', words.Select(SynonymProvider.NormalizeWord));
        }

        public async Task<List<BugSummariesDto>> Handle(BugComparisonQuery request, CancellationToken cancellationToken)
        {
            var exitingBugs = await _context.Bugs
                .Where(b => b.CategoryId == request.CategoryId)
                .ToListAsync(cancellationToken);

            var normalizedTitle = NormalizeText(request.Title);
            var normalizedDescription = NormalizeText(request.Description);
            var similarBugs = new List<BugSummariesDto>();
            var sw = System.Diagnostics.Stopwatch.StartNew();
            var tasks = exitingBugs.AsParallel().Select(bug =>
            {
                var normalizedBugTitle = NormalizeText(bug.Title);
                var normalizedBugDescription = NormalizeText(bug.Description);

                int titleScore = Fuzz.TokenSetRatio(normalizedTitle, normalizedBugTitle);
                int descriptionScore = Fuzz.TokenSetRatio(normalizedDescription, normalizedBugDescription);
                if (titleScore >= _bugComparisonConfig.FuzzyMatchThreshold &&
                    descriptionScore >= _bugComparisonConfig.FuzzyMatchThreshold)
                {
                    return _mapper.Map<BugSummariesDto>(bug);
                }
                return null;
            }).ToList();

            foreach (var bug in tasks)
            {
                if (bug != null)
                {
                    similarBugs.Add(bug);
                }
            }

            sw.Stop();
            return similarBugs;
        }
    }
}
