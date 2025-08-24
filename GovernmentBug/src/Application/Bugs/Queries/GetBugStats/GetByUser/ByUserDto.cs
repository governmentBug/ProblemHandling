using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByUser
{
    public class ByUserDto
    {
        public int TotalBugs { get; set; }
        public int TreatBugs { get; set; }
        public double AverageTreatmenTime { get; set; }
        public ByPriorityDto ByPriority { get; set; } = new ByPriorityDto();
    }
}
