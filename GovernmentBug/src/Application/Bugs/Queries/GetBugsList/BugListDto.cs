
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Domain.Entities;

namespace GovernmentBug.Application.Bugs.Queries.GetBugsList
{
    public class BugListDto
    {
        public int BugID { get; init; }
        public string? Title { get; init; }
        public string? Description { get; init; }
        public string? PriortyId { get; init; }
        public string? StatusId { get; init; }
        public int CreatedByUserId { get; init; }
        public DateTime CreatedDate { get; init; }
        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<Bug,BugListDto >();
            }
        }
    }

}
