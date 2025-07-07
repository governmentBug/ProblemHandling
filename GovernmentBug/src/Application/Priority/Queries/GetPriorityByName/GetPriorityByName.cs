using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.Priority.Queries.GetPriorityByName
{
    public record class GetPriorityByNameQuery(string Name) : IRequest<PriorityDto>
    {
    }
public class GetPriorityByNameQueryHandler : IRequestHandler<GetPriorityByNameQuery, PriorityDto>
    {
        private readonly IApplicationDbContext _context;

        public GetPriorityByNameQueryHandler(IApplicationDbContext dbContext)
        {
            _context = dbContext;
        }

        public async Task<PriorityDto> Handle(GetPriorityByNameQuery request, CancellationToken cancellationToken)
        {
            var priority = await _context.Priorities
                .Where(p => p.PriorityName == request.Name)
                .Select(p => new PriorityDto
                {
                    Id = p.Id,
                    PriorityName = p.PriorityName
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (priority == null)
            {
                throw new InvalidOperationException($"Priority with name '{request.Name}' was not found.");
            }
            return priority;
        }
    }

}
