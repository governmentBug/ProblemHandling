using System;
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
    public DateTime CommentDate { get; init; }  
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
        var bug = await _context.Bugs
                  .AsNoTracking()
                   .Where(b => b.BugID == request.BugID)
                    .Include(b => b.CreatedByUser)
                    .Select(b => new BugDetalsDto
                    {
                        BugId = b.BugID,
                        //CategoryName = b.Category.Name,
                        Title = b.Title,
                        Description = b.Description,
                        PriorityName = b.PriortyId,
                        StatusName = b.StatusId.ToString(),
                        AssignedToUserFullName = b.StatusId == StatusBug.In_progress ? b.CreatedByUser.FullName : null,
                        CreatedByUserFullName = b.CreatedByUser.FullName,
                        CreatedDate = b.CreatedDate
                    })
                   .FirstOrDefaultAsync(cancellationToken);
        if (bug == null)
            throw new NotFoundException(nameof(Bug), request.BugID.ToString());

        var entity = new Comment
        {
            BugID = request.BugID,
            CommentText = request.CommentText,
            CommentedBy = request.CommentedBy,
            CommentDate = request.CommentDate
        };

        entity.AddDomainEvent(new TodoCommentCreated(entity));

        _context.Comments.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.CommentID;
    }

}
