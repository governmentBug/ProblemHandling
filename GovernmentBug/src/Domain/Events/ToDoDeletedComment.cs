using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Events;
public class ToDoDeletedCommentEvent:BaseEvent
{
    public ToDoDeletedCommentEvent(Comment item)
    {
        Item = item;
    }

    public Comment Item { get; }
}
