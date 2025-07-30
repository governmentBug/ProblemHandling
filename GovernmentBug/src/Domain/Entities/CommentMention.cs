using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Entities;
public class CommentMention : BaseAuditableEntity
{
    [Key]
    public int CommentMentionId { get; set; }
    public int CommentId { get; set; }
    public virtual Comment Comment { get; set; } = null!;
    public int UserID { get; set; }
    public virtual Users user { get; set; } = null!;
}
