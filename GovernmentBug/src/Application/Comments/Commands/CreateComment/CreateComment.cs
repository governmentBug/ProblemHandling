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
    public List<int> usersMentions { get; set; } =new();
}

public class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly IMentionService _mentionService;
    private readonly IHtmlSanitizerService _htmlSanitizerService;
    public CreateCommentCommandHandler(IApplicationDbContext context,IMentionService mentionService, IHtmlSanitizerService htmlSanitizerService)
    {
        _context = context;
        _mentionService = mentionService;
        _htmlSanitizerService = htmlSanitizerService;
    }

    public async Task<int> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
    {
        var bug = await _context.Bugs.FindAsync(new object[] { request.BugID }, cancellationToken);
        Guard.Against.NotFound(request.BugID, bug);
        if (bug == null)
            throw new NotFoundException(nameof(Bug), request.BugID.ToString());
        var validUsers = await _context.AppUsers
            .Where(u => request.usersMentions.Contains(u.Id))
            .Select(u => u.Id)
            .ToListAsync(cancellationToken);

        var invalidUserIds = request.usersMentions.Except(validUsers).ToList();
        if (invalidUserIds.Any())
            throw new ValidationException($"המשתמשים הבאים לא קיימים: {string.Join(", ", invalidUserIds)}");
        var commentText = _htmlSanitizerService.Sanitize(request.CommentText);
        var entity = new Comment
        {
            BugID = request.BugID,
            CommentText = commentText,
            CommentedBy = request.CommentedBy,
            CommentDate = DateTime.Now,
        };

        entity.AddDomainEvent(new TodoCommentCreated(entity));

        _context.Comments.Add(entity);

       var mentions = request.usersMentions
          .Distinct()                      
          .Select(userId => new CommentMention
          {
            CommentId= entity.CommentID,  
            UserID = userId             
          }).ToList();
        await _context.SaveChangesAsync(cancellationToken);
        //await _mentionService.SendMentionEmailsAsync(request.usersMentions, request.CommentText, request.BugID);
        return entity.CommentID;
    }

}
