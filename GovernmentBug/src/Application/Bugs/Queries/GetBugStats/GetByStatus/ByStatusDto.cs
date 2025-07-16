using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByStatus
{
    public class ByStatusDto
    {
        public int TotalBugs { get; set; }
        public ByPriorityDto OpenBugs { get; set; }
        public ByPriorityDto CloseBugs { get; set; }
        public ByPriorityDto ActiveBugs { get; set; }
        public ByPriorityDto CancelledBugs { get; set; }
        public ByStatusDto()
        {
            OpenBugs = new ByPriorityDto();
            CloseBugs = new ByPriorityDto();
            ActiveBugs = new ByPriorityDto();
            CancelledBugs = new ByPriorityDto();
        }
    }
}
