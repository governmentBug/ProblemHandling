
    using GovernmentBug.Application.Common.Interfaces;

    namespace GovernmentBug.Application.Bugs.Queries.GetBugStats;

    // בקשת שליפה עם פילטרים
    public record GetBugsWithFiltersQuery(
        DateTime? FromDate,
        DateTime? ToDate,
        int? Priority
    ) : IRequest<List<BugsStatsDto>>;

    // הטיפול בבקשת השליפה
    public class GetBugsWithFiltersQueryHandler : IRequestHandler<GetBugsWithFiltersQuery, List<BugsStatsDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GetBugsWithFiltersQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

    public async Task<List<BugsStatsDto>> Handle(GetBugsWithFiltersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Bugs.AsQueryable();

        if (request.FromDate.HasValue)
            query = query.Where(b => b.CreatedDate >= request.FromDate.Value);

        if (request.ToDate.HasValue)
            query = query.Where(b => b.CreatedDate <= request.ToDate.Value);

        if (request.Priority.HasValue)
        {
            // Convert the integer Priority value to a string for comparison
            string priorityString = request.Priority.Value.ToString();
            query = query.Where(b => b.PriortyId == priorityString);
        }

        return await query
            .AsNoTracking()
            .ProjectTo<BugsStatsDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }

}
