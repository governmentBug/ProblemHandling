using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Priority.Commands.CreatePriority
{
    public record class CreatePriorityCommand(string PriorityName) : IRequest<int>
    {
    }
    public class CreatePriorityCommandHandler : IRequestHandler<CreatePriorityCommand, int>
    {
        private readonly IApplicationDbContext _context;
        public CreatePriorityCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<int> Handle(CreatePriorityCommand request, CancellationToken cancellationToken)
        {
            var entity = new Domain.Entities.Priority
            {
                PriorityName = request.PriorityName
            };
            _context.Priorities.Add(entity);
            await _context.SaveChangesAsync(cancellationToken);
            return entity.PriorityId;
        }
    }
  
}
