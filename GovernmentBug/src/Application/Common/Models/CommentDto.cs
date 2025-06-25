using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Domain.Common;

namespace GovernmentBug.Application.Common.Models;
using System;


public class CommentDto
{
    public int CommentID { get; set; }
    public int BugID { get; set; }
    public string CommentText { get; set; } = string.Empty;
    public int CommentedBy { get; set; }
    public DateTime CommentDate { get; set; }
}


