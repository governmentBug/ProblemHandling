using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
namespace GovernmentBug.Application.Bugs.Queries.GetBugsList
{
    public record GetBugSummaries : IRequest<List<BugSummariesDto>>;

    public class GetBugSummariesQueryHandler : IRequestHandler<GetBugSummaries, List<BugSummariesDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetBugSummariesQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<BugSummariesDto>> Handle(GetBugSummaries request, CancellationToken cancellationToken)
        {
            return await _context.Bugs
                .AsNoTracking()
                .ProjectTo<BugSummariesDto>(_mapper.ConfigurationProvider)
                .OrderBy(b => b.Title)
                .ToListAsync(cancellationToken);
        }
    }

}
