using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Events;
public class TodoAttachmentsCreatedEvent : BaseEvent
{
    public TodoAttachmentsCreatedEvent(Attachments attachments)
    {
        Attachments = attachments;
    }
    public Attachments Attachments { get; }
}
