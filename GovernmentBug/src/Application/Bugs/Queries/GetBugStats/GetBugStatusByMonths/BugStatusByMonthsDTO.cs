using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Domain.Entities;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats.GetBugStatusByMonths
{
        public class BugStatusByMonthsDTO
        {
            public Dictionary<string,int> CountByStatuses { get; set; }
            public BugStatusByMonthsDTO()
            {
               CountByStatuses = new Dictionary<string, int>();
            }
            public void Add(string name, int value)
            {
                if (CountByStatuses.ContainsKey(name))
                {
                    CountByStatuses[name] += value;
                }
                else
                {
                    CountByStatuses[name] = value;
                }
            }
        }

}

