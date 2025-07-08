using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetBugStatusByMonths;

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
            BugStatusByMonthsDTO bugStatusByMonthsDTO = new BugStatusByMonthsDTO();
            var query = _context.Bugs.AsQueryable();
            query = query.Where(b => b.Created.Month == request.Month && b.Created.Year == request.Year);
            var statuses = await _context.Statuses
                .ToListAsync(cancellationToken);
            foreach (var status in statuses)
            {
                int count = query.Count(b => b.StatusId == status.StatusId);
                bugStatusByMonthsDTO.Add(status.StatusName, count);
            }
            return bugStatusByMonthsDTO;
        }

    }


