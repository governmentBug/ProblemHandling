using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetBugStatusByMonths;

    // בקשת שליפה עם פילטרים
    public record GetBugsStatsQuery(int Month, int Year) : IRequest<BugStatusByMonthsDTO>;

    // הטיפול בבקשת השליפה
    public class GetBugsStatsQueryHandler : IRequestHandler<GetBugsStatsQuery, BugStatusByMonthsDTO>
    {
        private readonly IApplicationDbContext _context;

        public GetBugsStatsQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
        }

    public async Task<BugStatusByMonthsDTO> Handle(GetBugsStatsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Bugs.AsQueryable();
        query = query.Where(b => b.Created.Month == request.Month && b.Created.Year == request.Year);
        int total = await query.CountAsync(cancellationToken);
        int open = await query.CountAsync(b => b.Status == Domain.Enums.StatusBug.Open, cancellationToken);
        int closed = await query.CountAsync(b => b.Status == Domain.Enums.StatusBug.Closed, cancellationToken);
        int active = await query.CountAsync(b => b.Status == Domain.Enums.StatusBug.Active, cancellationToken);

        return new BugStatusByMonthsDTO
        {
            TotalBugs = total,
            OpenBugs = open,
            ClosedBugs = closed,
            ActiveBugs = active
        };
    }

    }


