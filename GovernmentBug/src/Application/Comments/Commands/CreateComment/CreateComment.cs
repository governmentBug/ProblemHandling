using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Bugs.Queries.GetBugDetails;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Entities;
using GovernmentBug.Domain.Enums;
using GovernmentBug.Domain.Events;

namespace GovernmentBug.Application.Comments.Commands.CreateComment;

public record CreateCommentCommand : IRequest<int>
{
    public int BugID { get; init; }             
    public string CommentText { get; init; } = string.Empty; 
    public int CommentedBy { get; init; }
    public List<int> usersMentions=[] ;
}

public class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, int>
{
    private readonly IApplicationDbContext _context;
    public CreateCommentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        var bug = await _context.Bugs.FindAsync(new object[] { request.BugID }, cancellationToken);
        Guard.Against.NotFound(request.BugID, bug);
        if (bug == null)
            throw new NotFoundException(nameof(Bug), request.BugID.ToString());

        var entity = new Comment
        {
            BugID = request.BugID,
            CommentText = request.CommentText,
            CommentedBy = request.CommentedBy,
            CommentDate = DateTime.Now,
        };

        entity.AddDomainEvent(new TodoCommentCreated(entity));

        _context.Comments.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.CommentID;
    }

}
