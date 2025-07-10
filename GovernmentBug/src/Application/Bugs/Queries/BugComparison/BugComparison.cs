using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Bugs.Queries.GetBugsList;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Entities;
using FuzzySharp;
using System.IO;
using CoenM.ImageHash;
using CoenM.ImageHash.HashAlgorithms;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using GovernmentBug.Application.Common.Models;
using GovernmentBug.Application.Common.Services;


namespace GovernmentBug.Application.Bugs.Queries.BugComparison
{
    public record class BugComparisonQuery():IRequest<List<BugSummariesDto>>
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<AttachmentDto> Attachments { get; set; } = new();
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

        string NormalizeText(string text)
        {
            var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            return string.Join(' ', words.Select(SynonymProvider.NormalizeWord));
        }
        public async Task<List<BugSummariesDto>> Handle(BugComparisonQuery request, CancellationToken cancellationToken)
        {
            Console.WriteLine(request.Title);
            var exitingBugs = await _context.Bugs
                .Where(b=>b.CategoryId == request.CategoryId)
                .ToListAsync(cancellationToken); 
            var similarBugs = new List<BugSummariesDto>();
            var sw = System.Diagnostics.Stopwatch.StartNew();
            foreach (var bug in exitingBugs)
            {

                string normalizedTitle = NormalizeText(request.Title);
                string normalizedBugTitle = NormalizeText(bug.Title);
                int titleScore = Fuzz.TokenSetRatio(normalizedTitle, normalizedBugTitle);
                string normalizedDescription = NormalizeText(request.Description);
                string normalizedBugDescription = NormalizeText(bug.Description);
                int descriptionScore = Fuzz.TokenSetRatio(normalizedDescription, normalizedBugDescription);
                Console.WriteLine(titleScore+"..."+descriptionScore+"....."+_bugComparisonConfig.FuzzyMatchThreshold);
                if (titleScore >= _bugComparisonConfig.FuzzyMatchThreshold &&
                    descriptionScore >= _bugComparisonConfig.FuzzyMatchThreshold)
                {
                    Console.WriteLine("-----------------------------------------");
                    similarBugs.Add(_mapper.Map<BugSummariesDto>(bug));
                }
            }
            sw.Stop();
            Console.WriteLine($"DB Load: {sw.ElapsedMilliseconds} ms");
            Console.WriteLine($"Loaded {exitingBugs.Count} bugs");
            return similarBugs;
        }
    }

}
