using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // 👈 תוודאי שזה קיים
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Entities
{
    [Table("Bug")] 
    public class Bug : BaseAuditableEntity
    {
        [Key]
        public int BugID { get; set; }
        [StringLength(225)]
        public string Title { get; set; } = string.Empty;
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;
        public int PriorityId { get; set; }
        public virtual Priority Priority  { get; set; } = null!;
        public int StatusId{ get; set; }
        public virtual Status Status { get; set; }=null!;   
        public  int CategoryId{ get; set; }
        public virtual Category Category { get; set; } = null!;
        public int CreatedByUserId { get; set; }
        public virtual Users CreatedByUser { get; set; } = null!;
        public DateTime CreatedDate { get; set; }
        [Range(0, 100, ErrorMessage = "Quality Score must be between 0 and 100.")]
        public int QualityScore { get; set; }
        [StringLength(100)]
        public string ReasonForClosure {  get; set; }=string.Empty;
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<Attachments> Attachments { get; set; } = new List<Attachments>();
        public ICollection<BugHistory> BugHistories { get; set; } = new List<BugHistory>();
    }
}
