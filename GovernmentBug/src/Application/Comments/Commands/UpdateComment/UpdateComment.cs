using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Services;
using GovernmentBug.Domain.Entities;

namespace GovernmentBug.Application.Comments.Commands.UpdateComment;
public record UpdateCommentCommand(int commentId) : IRequest
{
    public string CommentText { get; init; } = string.Empty;
    public int CommentedBy { get; init; }
}


public class UpdateCommentCommandHandler : IRequestHandler<UpdateCommentCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;
    
    public UpdateCommentCommandHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task Handle(UpdateCommentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Comments
            .FindAsync(new object[] { request.commentId }, cancellationToken);

        Guard.Against.NotFound(request.commentId, entity);
        entity.CommentText = request.CommentText;
        entity.CommentedBy = request.CommentedBy;
        entity.CommentDate = DateTime.Now;
        await _context.SaveChangesAsync(cancellationToken);
    }
}



