using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Entities;
using GovernmentBug.Domain.Events;

namespace GovernmentBug.Application.Comments.Commands.CreateComment;

public record CreateCommentCommand : IRequest<int>
{
    public int CommentID { get; set; }
    public int BugID { get; set; }
    public virtual Bug Bug { get; set; } = null!;
    public string CommentText { get; set; } = string.Empty;
    public int CommentedBy { get; set; }
    public DateTime CommentDate { get; set; }
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

            return entity.Id;
        }
    }
}
