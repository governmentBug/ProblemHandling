using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Common.Models
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        private class Mapping : Profile
        {
            public Mapping()
            {
                CreateMap<Domain.Entities.Category, CategoryDto>()
                    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CategoryId))
                    .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.CategoryName));
            }
        }
    }
}
