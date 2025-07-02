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

    public string PriortyId { get; set; } = string.Empty;

    public string StatusId { get; set; } = string.Empty;

    public int CreatedByUserId { get; set; }

    public string CreatedByUserFullName { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }

    public List<CommentDto> Comments { get; set; } = new();
}
