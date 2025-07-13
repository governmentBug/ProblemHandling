using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Bugs.Command.CreateBug;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Entities;
using GovernmentBug.Domain.Events;

namespace GovernmentBug.Application.Attachment.Command.CreateAttachment;
public class CreateAttachmentCommand : IRequest<int>
{
    //public int AttachmentId { get; set; }
    public int BugId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public byte[] FilePath { get; set; } = Array.Empty<byte>();

}

public class CreateBugCommandHandler : IRequestHandler<CreateAttachmentCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateBugCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateAttachmentCommand request, CancellationToken cancellationToken)
    {
        var entity = new Attachments
        {
            //AttachmentId = request.AttachmentId,
            BugId = request.BugId,
            FileName = request.FileName,
            FileType = request.FileType,
            FilePath = request.FilePath,
        };


        entity.AddDomainEvent(new TodoAttachmentsCreatedEvent(entity));

        _context.Attachments.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.AttachmentId;
    }
}
