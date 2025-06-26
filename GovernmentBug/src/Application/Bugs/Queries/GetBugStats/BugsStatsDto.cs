using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Domain.Entities;

namespace GovernmentBug.Application.Bugs.Queries.GetBugStats
    {
        public class BugsStatsDto
        {
            public int BugID { get; init; }

            public string Title { get; init; } = string.Empty;

            public string PriortyId { get; init; } = string.Empty;

            public string StatusId { get; init; } = string.Empty;

            public int CreatedByUserId { get; init; }

            public DateTime CreatedDate { get; init; }
            private class Mapping : Profile
            {
                public Mapping()
                {
                    CreateMap<Bug, BugsStatsDto>();
                }
            }
        }

    }

