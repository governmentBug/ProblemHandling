using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Domain.Common;

namespace GovernmentBug.Application.Common.Models;
public class BugDto : BaseAuditableEntity
{
    public int BugID { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public string PriorityName { get; set; } = string.Empty;
    public string StatusName { get; set; } = string.Empty;

    public int CreatedByUserId { get; set; }
    public string CreatedByUserFullName { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }
    public string ReasonForClosure { get; set; } = string.Empty;

    public UserDto User { get; set; } = new();
    public List<CommentDto> Comments { get; set; } = new();
}

