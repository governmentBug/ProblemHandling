using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Attachment.Queries.GetAttachmentBug;
using GovernmentBug.Application.Comments.Queires.GetCommentsBug;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Attachment.NewFolder;
public record GetAttachmentBug(int BugId) : IRequest<List<AttachmentBugDto>>;

public class GetAttacmentBugQueryHandler : IRequestHandler<GetAttachmentBug, List<AttachmentBugDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetAttacmentBugQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<AttachmentBugDto>> Handle(GetAttachmentBug request, CancellationToken cancellationToken)
    {
        var entity = await _context.Bugs
           .AsNoTracking()
           .FirstOrDefaultAsync(b => b.BugID == request.BugId, cancellationToken);
        Guard.Against.NotFound(request.BugId, entity);

        var Attachments = await _context.Attachments
               .AsNoTracking()
               .Where(b => b.BugId == request.BugId)
                .Select(b => new AttachmentBugDto
                {
                    AttachmentId=b.AttachmentId,
                    BugId=b.BugId,
                    FileName=b.FileName,
                    //FilePath= b.FilePath,
                    FileType =b.FileType
                })
               .ToListAsync(cancellationToken);

        return Attachments;
    }


}



