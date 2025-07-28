using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByMonth
{
    public class ByMonthsDto
    {
        public int[] ByMonth { get; set; }
        public ByMonthsDto() 
        {
            ByMonth = new int[12];
        }

        public void Add(int i, int capacity)
        {
            ByMonth[i-1] = capacity;
        }
    }
}

