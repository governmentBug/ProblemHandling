using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetTotalOpenBugs
{
    public record class GetTotalOpenBugsQuery: IRequest<int>
    {
    }
    public class GetTotalOpenBugsQueryHandler : IRequestHandler<GetTotalOpenBugsQuery, int>
    {
        private readonly IApplicationDbContext _context;
        public GetTotalOpenBugsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }
        public Task<int> Handle(GetTotalOpenBugsQuery request, CancellationToken cancellationToken)
        {
            var totalOpenBugs = _context.Bugs.Count(b => b.Status == Domain.Enums.StatusBug.Open);
            return Task.FromResult(totalOpenBugs);
        }
    }
}
