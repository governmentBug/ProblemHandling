using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Bugs.Command.DeleteBug
{
    public record DeleteBugCommand(int BugId) : IRequest;

    public class DeleteBugCommandHandler : IRequestHandler<DeleteBugCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteBugCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(DeleteBugCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Bugs
                .FindAsync(new object[] { request.BugId }, cancellationToken);

            Guard.Against.NotFound(request.BugId, entity);

            // מחיקת הבאג מה־DbSet
            _context.Bugs.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}

