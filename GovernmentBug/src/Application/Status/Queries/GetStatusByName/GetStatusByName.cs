using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.Status.Queries.GetStatusByName
{
    public record class GetStatusByNameQuery(string Name) : IRequest<StatusDto>
    {
    }
    public class GetStatusByNameQueryHandler : IRequestHandler<GetStatusByNameQuery, StatusDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public GetStatusByNameQueryHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<StatusDto> Handle(GetStatusByNameQuery request, CancellationToken cancellationToken)
        {
            var status = await _context.Statuses
                .FirstOrDefaultAsync(s => s.StatusName == request.Name, cancellationToken);
            if (status == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.Status), request.Name);
            }
            return _mapper.Map<StatusDto>(status);
        }
    }
}
