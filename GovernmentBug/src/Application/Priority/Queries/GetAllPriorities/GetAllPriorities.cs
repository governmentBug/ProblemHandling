using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;
using MediatR;

namespace GovernmentBug.Application.Priority.Queries.GetAllPriorities
{
    public record class GetAllPrioritiesQuery:IRequest<List<PriorityDto>>
    {
    }
    public class GetAllPrioritiesQueryHandler : IRequestHandler<GetAllPrioritiesQuery, List<PriorityDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public GetAllPrioritiesQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<List<PriorityDto>> Handle(GetAllPrioritiesQuery request, CancellationToken cancellationToken)
        {
            var priorities = await _context.Priorities.ToListAsync(cancellationToken);
            return _mapper.Map<List<PriorityDto>>(priorities);
        }
    }
}
