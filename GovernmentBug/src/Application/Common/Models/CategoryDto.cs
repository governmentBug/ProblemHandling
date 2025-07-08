using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Common.Models
{
    public class CategoryDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<Domain.Entities.Category, CategoryDto>().ReverseMap();
            }
        }
    }
}
