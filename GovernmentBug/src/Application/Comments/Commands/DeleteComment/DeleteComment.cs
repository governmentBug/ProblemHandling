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
        var entity = await _context.Comments.FindAsync(new object[] { request.CommentId }, cancellationToken);
        Guard.Against.NotFound(request.CommentId, entity);

        var mentionsToRemove = await _context.CommentMentions
            .Where(m => m.CommentId == request.CommentId)
            .ToListAsync(cancellationToken);

        _context.CommentMentions.RemoveRange(mentionsToRemove);

        _context.Comments.Remove(entity);

        entity.AddDomainEvent(new ToDoDeletedCommentEvent(entity));

        await _context.SaveChangesAsync(cancellationToken);
    }

}
