using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Events;
public class TodoBugCreatedEvent : BaseEvent
{
    public TodoBugCreatedEvent(Bug bug)
    {
        Bug = bug;
    }

    public Bug Bug { get; }
}
