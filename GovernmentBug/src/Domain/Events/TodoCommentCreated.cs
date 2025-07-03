using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Events;
public class TodoCommentCreated
{
    public TodoCommentCreated(Comment comment)
    {
        Comment = comment;
    }

    public Comment Comment { get; }
}

}
