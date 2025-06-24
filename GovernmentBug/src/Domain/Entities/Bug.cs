using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Domain.Common
{
    public class Bug : BaseEvent
    {
        public int BugID { get; set; }

        [StringLength(225)]
        public string Title { get; set; }

        public string Description { get; set; }

        [StringLength(50)]
        public string PriortyId { get; set; }

        [StringLength(50)]
        public string StatusId { get; set; }

        public int CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

    }
}
