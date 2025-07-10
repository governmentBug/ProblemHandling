using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Models;
using GovernmentBug.Domain.Common;
using GovernmentBug.Domain.Entities;
using GovernmentBug.Domain.Events;

namespace GovernmentBug.Application.Common.Mappings;
public class MappingProfile:Profile
{
    public MappingProfile()
    {
            CreateMap<Bug, BugDto>()
                .ForMember(dest => dest.PriorityName,
                    opt => opt.MapFrom(src => src.Priority.PriorityName))
                .ForMember(dest => dest.StatusName,
                    opt => opt.MapFrom(src => src.Status.StatusName))
                .ForMember(dest => dest.CreatedByUserFullName,
                    opt => opt.MapFrom(src => src.CreatedByUser.FullName))
                .ForMember(dest => dest.User,
                    opt => opt.MapFrom(src => src.CreatedByUser))
                .ForMember(dest => dest.Comments,
                    opt => opt.MapFrom(src => src.Comments))
                .ReverseMap(); // אם תרצי גם ההמרה ההפוכה

        CreateMap<Comment, CommentDto>().ReverseMap();
        CreateMap<Users, UserDto>().ReverseMap();
    }
}

