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

        /// <summary>
        /// Comment identifier (Primary Key)
        /// </summary>
        [Key]
        public int CommentID { get; set; }
        /// <summary>
        /// Foreign key to the Bugs table
        /// </summary>
        public int BugID { get; set; }

        /// <summary>
        /// The content of the comment
        /// </summary>
        public string CommentText { get; set; } = string.Empty;

        /// <summary>
        /// User identifier who made the comment
        /// </summary>
        public int CommentedBy { get; set; }

        /// <summary>
        /// Date and time the comment was added
        /// </summary>
        public DateTime CommentDate { get; set; }
    }
}
