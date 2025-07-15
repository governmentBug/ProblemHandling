using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Common.Models;
public class UserDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public List<BugDto> CreatedBugs { get; set; } = new();
    public class Mapper : Profile
    {
        public Mapper() 
        {
            CreateMap<Domain.Entities.Users, UserDto>()
                .ReverseMap();
        }
    }

}
