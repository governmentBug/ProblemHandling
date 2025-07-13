
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Domain.Entities;

namespace GovernmentBug.Application.Bugs.Queries.GetBugsList
{
    public class BugSummariesDto
    {
        public int BugID { get; init; }
        public string? Title { get; init; }
        public DateTime CreatedDate { get; set; }
        public int StatusId { get; set; }
        public string  StatusName { get; set; } = null!;
        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<Bug, BugSummariesDto>().ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.StatusName));
            }
        }
    }

}
