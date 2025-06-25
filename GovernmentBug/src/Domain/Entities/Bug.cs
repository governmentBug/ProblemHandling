using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Entities
{
    public class Bug : BaseEvent
    {
        [Key]
        public int BugID { get; set; }

        [StringLength(225)]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [StringLength(50)]
        public string PriortyId { get; set; }= string.Empty;

        [StringLength(50)]
        public string StatusId { get; set; } = string.Empty;

        public int CreatedBy { get; set; }
        public virtual User CreatedByUser { get; set; } = null!;

        public DateTime CreatedDate { get; set; }
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();

    }
}
