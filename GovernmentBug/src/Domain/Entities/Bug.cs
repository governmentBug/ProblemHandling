using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // 👈 תוודאי שזה קיים
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Entities
{
    [Table("Bug")] // 👈 זו השורה החשובה
    public class Bug : BaseAuditableEntity
    {
        [Key]
        public int BugID { get; set; }

        [StringLength(225)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [StringLength(50)]
        public string PriortyId { get; set; } = string.Empty;

        //כדי לא להפעיל מידי הרבה מיגרציות לפני תשובה ברורה...
        public StatusBug Status{ get; set; }

        public int CreatedByUserId { get; set; }

        public virtual Users CreatedByUser { get; set; } = null!;

        public DateTime CreatedDate { get; set; }

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
