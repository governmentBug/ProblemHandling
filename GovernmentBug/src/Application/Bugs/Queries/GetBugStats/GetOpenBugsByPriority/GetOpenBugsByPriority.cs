using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetOpenBugsByPriority
{
   public record class GetOpenBugsByPriorityQuery : IRequest<OpenBugsByPriorityDto>{}
public class GetOpenBugsByPriorityQueryHandler : IRequestHandler<GetOpenBugsByPriorityQuery, OpenBugsByPriorityDto>
    {
        private readonly IApplicationDbContext _context;

        public GetOpenBugsByPriorityQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OpenBugsByPriorityDto> Handle(GetOpenBugsByPriorityQuery request, CancellationToken cancellationToken)
        {
            var properties = _context.Priorities.Include(p => p.Bugs);
            var openStatus = await _context.Statuses
                .Where(s => s.StatusName.Equals("סגור"))
                .FirstOrDefaultAsync(cancellationToken);

            if (openStatus == null)
            {
                throw new InvalidOperationException("Open status not found.");
            }

            int openStatusId = openStatus.StatusId;
            var result = new OpenBugsByPriorityDto();
            foreach (var property in properties)
            {
                int count = property.Bugs.Count(b => b.Status.StatusId == openStatusId);
                result.AddProperty(property.PriorityName, count);
            }
            return result;
        }
    }
}
