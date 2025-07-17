using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Events;

namespace GovernmentBug.Application.Attachment.Command.DeleteAttachment;
public record DeleteAttachmentCommand(int AttachmentId) : IRequest;
public class DeleteAttachmentCommandHandler : IRequestHandler<DeleteAttachmentCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteAttachmentCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteAttachmentCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Attachments
        .FirstOrDefaultAsync(c => c.AttachmentId == request.AttachmentId, cancellationToken);

        Guard.Against.NotFound(request.AttachmentId, entity);
        _context.Attachments.Remove(entity);

        entity.AddDomainEvent(new ToDoDeletedAttachmentEvent(entity));

        await _context.SaveChangesAsync(cancellationToken);
    }
}

