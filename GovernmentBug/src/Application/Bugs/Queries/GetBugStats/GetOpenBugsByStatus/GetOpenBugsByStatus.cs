using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetOpenBugsByStatus;

    // בקשת שליפה עם פילטרים
    public record GetBugsStatsQuery : IRequest<OpenBugsByStatusDto>;

    // הטיפול בבקשת השליפה
    public class GetBugsStatsQueryHandler : IRequestHandler<GetBugsStatsQuery, OpenBugsByStatusDto>
    {
        private readonly IApplicationDbContext _context;

        public GetBugsStatsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
        }

    public async Task<OpenBugsByStatusDto> Handle(GetBugsStatsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Bugs.AsQueryable();

        int total = await query.CountAsync(cancellationToken);
        int open = await query.CountAsync(b => b.Status == Domain.Enums.StatusBug.Open, cancellationToken);
        int closed = await query.CountAsync(b => b.Status == Domain.Enums.StatusBug.Closed, cancellationToken);
        int active = await query.CountAsync(b => b.Status == Domain.Enums.StatusBug.Active, cancellationToken);

        return new OpenBugsByStatusDto
        {
            TotalBugs = total,
            OpenBugs = open,
            ClosedBugs = closed,
            ActiveBugs = active
        };
    }

    }


