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
        public Dictionary<int, double>? ByMonth { get; set; }

        public ByMonthsDto(int[] bugByMonth,int total)
        {
            TotalBugs = total;
            ByMonth = new Dictionary<int, double>
               {
                   { 1, bugByMonth[0] },
                   { 2, bugByMonth[1] },
                   { 3, bugByMonth[2] },
                   { 4, bugByMonth[3] },
                   { 5, bugByMonth[4] },
                   { 6, bugByMonth[5] },
                   { 7, bugByMonth[6] },
                   { 8, bugByMonth[7] },
                   { 9, bugByMonth[8] },
                   { 10, bugByMonth[9] },
                   { 11, bugByMonth[10] },
                   { 12, bugByMonth[11] }
               };
        }
    }
}

