using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.Bugs.Queries.GetBugs
{
    public record GetBugsQuery : IRequest<List<BugDto>>;

    public class GetBugsQueryHandler : IRequestHandler<GetBugsQuery, List<BugDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetBugsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<BugDto>> Handle(GetBugsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Bugs
                .AsNoTracking()
                .ProjectTo<BugDto>(_mapper.ConfigurationProvider)
                .OrderBy(b => b.Title)
                .ToListAsync(cancellationToken);
        }
    }

}
