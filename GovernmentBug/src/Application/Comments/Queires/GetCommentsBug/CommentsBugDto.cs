using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Models;
using GovernmentBug.Domain.Entities;

namespace GovernmentBug.Application.Comments.Queires.GetCommentsBug;
public class CommentsBugDto
{
    public int CommentID { get; set; }
    public int BugID { get; set; }
    public string CommentText { get; set; } = string.Empty;
    public int CommentedBy { get; set; }
    public DateTime CommentDate { get; set; }
    public List<UserDto> usersMentions { get; set; } = new();
}
