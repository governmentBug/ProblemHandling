
    using GovernmentBug.Application.Common.Interfaces;

    namespace GovernmentBug.Application.Bugs.Queries.GetBugStats;

    // בקשת שליפה עם פילטרים
    public record GetBugsStatsQuery : IRequest<BugsStatsDto>;

    // הטיפול בבקשת השליפה
    public class GetBugsStatsQueryHandler : IRequestHandler<GetBugsStatsQuery, BugsStatsDto>
    {
        private readonly IApplicationDbContext _context;

        public GetBugsStatsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
        }

    public async Task<BugsStatsDto> Handle(GetBugsStatsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Bugs.AsQueryable();

        int total = await query.CountAsync(cancellationToken);
        int open = await query.CountAsync(b => b.StatusId == Domain.Enums.StatusBug.Open, cancellationToken);
        int closed = await query.CountAsync(b => b.StatusId == Domain.Enums.StatusBug.Closed, cancellationToken);

        return new BugsStatsDto
        {
            TotalBugs = total,
            OpenBugs = open,
            ClosedBugs = closed,
            AverageResolutionTime = 1
        };
    }

    }


