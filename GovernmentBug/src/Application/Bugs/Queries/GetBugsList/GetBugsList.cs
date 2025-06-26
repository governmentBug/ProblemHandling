using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
namespace GovernmentBug.Application.Bugs.Queries.GetBugsList
{
    public record GetBugsQuery : IRequest<List<BugListDto>>;

    public class GetBugsQueryHandler : IRequestHandler<GetBugsQuery, List<BugListDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetBugsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<BugListDto>> Handle(GetBugsQuery request, CancellationToken cancellationToken)
        {
            return await _context.Bugs
                .AsNoTracking()
                .ProjectTo<BugListDto>(_mapper.ConfigurationProvider)
                .OrderBy(b => b.Title)
                .ToListAsync(cancellationToken);
        }
    }

}
