using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.TodoItems.Commands.DeleteTodoItem;
using GovernmentBug.Domain.Events;

namespace GovernmentBug.Application.Comments.Commands.DeleteComment;
public record DeleteCommentCommand(int CommentId):IRequest;
    public class DeleteCommentCommandHandler : IRequestHandler<DeleteCommentCommand>
    {
        private readonly IApplicationDbContext _context;

        public DeleteCommentCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
        {
            var entity = await _context.Comments
            .FirstOrDefaultAsync(c => c.CommentID == request.CommentId, cancellationToken);

            Guard.Against.NotFound(request.CommentId, entity);
            _context.Comments.Remove(entity);

            entity.AddDomainEvent(new ToDoDeletedCommentEvent(entity));

            await _context.SaveChangesAsync(cancellationToken);
        }  
}
