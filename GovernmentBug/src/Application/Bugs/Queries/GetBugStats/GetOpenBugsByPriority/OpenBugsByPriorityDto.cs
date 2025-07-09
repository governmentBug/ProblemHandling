using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetOpenBugsByPriority
{
    public class OpenBugsByPriorityDto
    {
        public Dictionary<string,int> Properties { get; set; }
        public OpenBugsByPriorityDto()
        {
            Properties = new Dictionary<string, int>();
        }
        public void AddProperty(string priorityName, int count)
        {
            if (Properties.ContainsKey(priorityName))
            {
                Properties[priorityName] += count;
            }
            else
            {
                Properties[priorityName] = count;
            }
        }
    }
}
