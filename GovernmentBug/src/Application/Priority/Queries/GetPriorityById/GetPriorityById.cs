using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.Priority.Queries.GetPriorityById
{
    public record class GetPriorityByIdQuery(int Id) : IRequest<PriorityDto>
    {
    }
    public class GetPriorityByIdQueryHandler : IRequestHandler<GetPriorityByIdQuery, PriorityDto>
    {
        private readonly IApplicationDbContext _context;
        public GetPriorityByIdQueryHandler(IApplicationDbContext dbContext)
        {
            _context = dbContext;
        }
        public async Task<PriorityDto> Handle(GetPriorityByIdQuery request, CancellationToken cancellationToken)
        {
            var priority = await _context.Priorities
                .Where(p => p.Id == request.Id)
                .Select(p => new PriorityDto
                {
                    PriorityId = p.Id,
                    PriorityName = p.PriorityName
                })
                .FirstOrDefaultAsync(cancellationToken);
            if (priority == null)
            {
                throw new InvalidOperationException($"Priority with ID '{request.Id}' was not found.");
            }
            return priority;
        }
    }
}
