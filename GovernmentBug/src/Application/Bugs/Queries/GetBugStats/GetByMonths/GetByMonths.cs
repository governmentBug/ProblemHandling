using System;

using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByMonth
{
    public record class GetByMonthsQuery(int Year, int? CategoryId, int? UserId) : IRequest<ByMonthsDto>;
    public class GetByMonthsQueryHandler: IRequestHandler<GetByMonthsQuery, ByMonthsDto>
    {
        private readonly IApplicationDbContext _context;

        public GetByMonthsQueryHandler(IApplicationDbContext context) => _context = context;

        public Task<ByMonthsDto> Handle(GetByMonthsQuery request, CancellationToken cancellationToken)
        {
            var lastYear = DateTime.Now.AddMonths(-12*(request.Year+1));
            var bugs = _context.Bugs
                .Where(b => b.CreatedDate >= lastYear)
                .Where(b => !request.CategoryId.HasValue || b.CategoryId == request.CategoryId)
                .Where(b => !request.UserId.HasValue || b.CreatedByUserId == request.UserId);
            var byMonthsDto = new ByMonthsDto();
            foreach (var b in bugs)
            {
                var month = b.CreatedDate.ToString("MMMM", new System.Globalization.CultureInfo("he-IL"));
                byMonthsDto.Add(month, 1);
            }
            return Task.FromResult(byMonthsDto);
        }
    }
}


