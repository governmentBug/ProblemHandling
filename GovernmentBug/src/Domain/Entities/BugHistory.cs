using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Events
{
    public class BugHistory : BaseAuditableEntity
    {
        [Key]
        public int HistoryID {  get; set; }
        public int BugID { get; set; }

        [StringLength(100)]
        public string ChangedField { get; set; }

        [StringLength(255)]
        public string OldValue { get; set; }

        [StringLength(255)]
        public string NewValue { get; set; }
        public int ChangedBy { get; set; }
        public DateTime ChangeDate { get; set; }
    }
}
