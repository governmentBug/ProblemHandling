using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.Status.Queries.GeAlltStatuses
{
    public record class GetAllStatusesQuery : IRequest<List<StatusDto>>
    {
    }
public class GetAllStatusesQueryHandler : IRequestHandler<GetAllStatusesQuery, List<StatusDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public GetAllStatusesQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<List<StatusDto>> Handle(GetAllStatusesQuery request, CancellationToken cancellationToken)
        {
            var statuses = await _context.Statuses
                .ToListAsync(cancellationToken);
            return _mapper.Map<List<StatusDto>>(statuses); // Fix: Map to a List<StatusDto> instead of a single StatusDto
        }
    }
}
