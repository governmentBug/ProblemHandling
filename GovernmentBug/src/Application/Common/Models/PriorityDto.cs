using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Common.Models
{
    public class PriorityDto
    {
        public int Id { get; set; }
        public string PriorityName { get; set; } = string.Empty;
        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<Domain.Entities.Priority, PriorityDto>();
            }
        }
    }
}
