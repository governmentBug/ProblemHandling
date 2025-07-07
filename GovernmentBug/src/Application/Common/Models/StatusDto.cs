using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Common.Models
{
    public class StatusDto
    {
        public int StatusId { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<Domain.Entities.Status, StatusDto>().ReverseMap();
            }
        }
    }
}
