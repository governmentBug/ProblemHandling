using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.Attachment.Command.CreateAttachment;

    public class CreateAttachmentCommandNew : IRequest
    {
        public int BugId { get; set; }

        public List<AttachmentUploadDto> Files { get; set; } = new();
    }

    public class CreateAttachmentCommandHandler : IRequestHandler<CreateAttachmentCommandNew>
    {
        private readonly IApplicationDbContext _context;
        private readonly IAttachmentConverter _attachmentConverter;

        public CreateAttachmentCommandHandler(
            IApplicationDbContext context,
            IAttachmentConverter attachmentConverter)
        {
            _context = context;
            _attachmentConverter = attachmentConverter;
        }

        public async Task Handle(CreateAttachmentCommandNew request, CancellationToken cancellationToken)
        {
            var bug = await _context.Bugs.FindAsync(new object[] { request.BugId }, cancellationToken);
            Guard.Against.NotFound(request.BugId, bug);

            foreach (var dto in request.Files ?? Enumerable.Empty<AttachmentUploadDto>())
            {
                var attachment = await _attachmentConverter.ConvertToAttachmentAsync(
                    dto.File, request.BugId, dto.IsFilm);

                _context.Attachments.Add(attachment);
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }


