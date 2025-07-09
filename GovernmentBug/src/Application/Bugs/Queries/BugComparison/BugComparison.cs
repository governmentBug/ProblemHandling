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


namespace GovernmentBug.Application.Bugs.Queries.BugComparison
{
    public record class BugComparisonQuery():IRequest<List<BugSummariesDto>>
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<AttachmentDto> Attachments { get; set; } = new();
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
        public async Task<List<BugSummariesDto>> Handle(BugComparisonQuery request, CancellationToken cancellationToken)
        {
            var exitingBugs = await _context.Bugs.ToListAsync(cancellationToken); 
            var similarBugs = new List<BugSummariesDto>();
            foreach (var bug in exitingBugs)
            {
                int titleScore = Fuzz.Ratio(request.Title, bug.Title);
                int descriptionScore = Fuzz.Ratio(request.Description, bug.Description);
                if (titleScore >= _bugComparisonConfig.FuzzyMatchThreshold &&
                    descriptionScore >= _bugComparisonConfig.FuzzyMatchThreshold)
                {
                    similarBugs.Add(_mapper.Map<BugSummariesDto>(bug));
                }
            }
            return similarBugs;
        }
    }

}
