using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Common.Models
{
    public class StatusDto
    {
        public int Id { get; set; }
        public string StatusName { get; set; } = string.Empty;
        private class Mapping : AutoMapper.Profile
        {
            public Mapping()
            {
                CreateMap<Domain.Entities.Status, StatusDto>()
                    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.StatusId))
                    .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.StatusName));
            }
        }
    }
}
