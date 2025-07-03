using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByMonth
{
    public class ByMonthsDto
    {
        public int TotalBugs { get; set; }
        public int[] ByMonth { get; set; }

        public ByMonthsDto(int[] bugByMonth,int total)
        {
            TotalBugs = total;
            ByMonth = bugByMonth;   
        }
    }
}

