using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.Status.Queries.GetStatusById
{
    public record class GetStatusByIdQuery(int Id) : IRequest<StatusDto>
    {
    }
    public class GetStatusByIdQueryHandler : IRequestHandler<GetStatusByIdQuery, StatusDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public GetStatusByIdQueryHandler(IApplicationDbContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<StatusDto> Handle(GetStatusByIdQuery request, CancellationToken cancellationToken)
        {
            var status = await _context.Statuses
                .FirstOrDefaultAsync(s => s.StatusId == request.Id, cancellationToken);
            if (status == null)
            {
                throw new NotFoundException(nameof(Domain.Entities.Status), request.Id.ToString());
            }
            return _mapper.Map<StatusDto>(status);
        }
    }

}
