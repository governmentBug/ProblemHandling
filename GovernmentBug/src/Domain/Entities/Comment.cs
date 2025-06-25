using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Entities
{
    public class Comment:BaseAuditableEntity
    {

        [Key]
        public int CommentID { get; set; }
        public int BugID { get; set; }
        public virtual Bug Bug { get; set; } = null!;
        public string CommentText { get; set; } = string.Empty;
        public int CommentedBy { get; set; }
        public DateTime CommentDate { get; set; }
    }
}
