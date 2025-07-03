using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Domain.Entities;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetOpenBugsByStatus
    {
        public class OpenBugsByStatusDto
        {
        public int TotalBugs { get; set; }
        public int OpenBugs { get; set; }
        public int ClosedBugs { get; set; }
        public int ActiveBugs { get; set; }
    }

    }

