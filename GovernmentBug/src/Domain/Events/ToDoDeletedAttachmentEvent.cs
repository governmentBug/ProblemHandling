using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Events;
public class ToDoDeletedAttachmentEvent:BaseEvent
{
    public ToDoDeletedAttachmentEvent(Attachments attachment)
    {
        Attachment = attachment;
    }
    public Attachments Attachment { get; }
}
