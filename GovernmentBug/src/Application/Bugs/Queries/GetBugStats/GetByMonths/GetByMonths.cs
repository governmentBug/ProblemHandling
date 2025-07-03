using System;

using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByMonth
{
    public record class GetByMonthsQuery(int? year) : IRequest<ByMonthsDto>
    {
    }
    public class GetByMonthsQueryHandler : IRequestHandler<GetByMonthsQuery, ByMonthsDto>
    {
        private readonly IApplicationDbContext _context;
        public GetByMonthsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public Task<ByMonthsDto> Handle(GetByMonthsQuery request, CancellationToken cancellationToken)
        {
            var query = _context.Bugs.AsQueryable();
            if (request.year != null)
            {
                query = query.Where(b => b.CreatedDate.Year == request.year);
            }
            var bugByMonth = new int[12];
            foreach (var bug in query)
            {
                if (bug.CreatedDate.Month >= 1 && bug.CreatedDate.Month <= 12)
                {
                    bugByMonth[bug.CreatedDate.Month - 1]++;
                }
            }
            var byMonthsDto = new ByMonthsDto(bugByMonth, query.Count()) { };
            return Task.FromResult(byMonthsDto);
        }
    }
}


