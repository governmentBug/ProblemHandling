using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByMonth
{
    public class ByMonthsDto
    {
        public Dictionary<string, int> ByMonth { get; set; } = new Dictionary<string, int>();

        public void Add(string month, int capacity)
        {
            if (ByMonth.ContainsKey(month))
            {
                ByMonth[month] += capacity;
            }
            else
            {
                ByMonth[month] = capacity;
            }
        }
    }
}

