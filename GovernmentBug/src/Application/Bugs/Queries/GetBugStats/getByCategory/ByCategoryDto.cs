using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.getByCategory
{
    public class ByCategoryDto
    {
        public int TotalBugs { get; set; }
        public Dictionary<string, int> ByCategory { get; set; } = new Dictionary<string, int>();
    }
}
