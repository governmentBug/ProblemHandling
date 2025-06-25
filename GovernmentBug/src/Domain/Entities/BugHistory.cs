using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Entities
{
    public class BugHistory : BaseAuditableEntity
    {
        [Key]
        public int HistoryID {  get; set; }
        public int BugID { get; set; }
        public virtual Bug Bug { get; set; } = null!;


        [StringLength(100)]
        public string ChangedField { get; set; }=string.Empty;

        [StringLength(255)]
        public string OldValue { get; set; }= string.Empty;

        [StringLength(255)]
        public string NewValue { get; set; }=string.Empty ;
        public int ChangedBy { get; set; }
        public DateTime ChangeDate { get; set; }
    }
}
