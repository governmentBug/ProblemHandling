using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.Status.Commands.CreateStatus
{
    public record class CreateStatusCommand(string Name) : IRequest<StatusDto>
    {
    }
    public class CreateStatusHandler : IRequestHandler<CreateStatusCommand, StatusDto>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;
        public CreateStatusHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<StatusDto> Handle(CreateStatusCommand request, CancellationToken cancellationToken)
        {
            var status = new Domain.Entities.Status
            {
                StatusName = request.Name
            };
            _context.Statuses.Add(status);
            await _context.SaveChangesAsync(cancellationToken);
            return _mapper.Map<StatusDto>(status);
        }
    }
}
