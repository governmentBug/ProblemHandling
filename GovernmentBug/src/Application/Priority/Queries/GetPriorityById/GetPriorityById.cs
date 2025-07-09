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
        private readonly IMapper _mapper;
        public GetPriorityByIdQueryHandler(IApplicationDbContext dbContext,IMapper mapper)
        {
            _context = dbContext;
            _mapper = mapper;
        }
        public async Task<PriorityDto> Handle(GetPriorityByIdQuery request, CancellationToken cancellationToken)
        {
            var priority = await _context.Priorities
                .Where(p => p.Id == request.Id)
                .FirstOrDefaultAsync(cancellationToken);
            if (priority == null)
            {
                throw new InvalidOperationException($"Priority with ID '{request.Id}' was not found.");
            }
            return _mapper.Map<PriorityDto>(priority);
        }
    }
}
