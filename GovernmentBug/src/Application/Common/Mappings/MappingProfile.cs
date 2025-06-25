using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Domain.Common;
using GovernmentBug.Domain.Entities;
using GovernmentBug.Domain.Events;

namespace GovernmentBug.Application.Common.Mappings;
public class MappingProfile:Profile
{
    public MappingProfile()
    {
        //הכנתי למחלקות שעדין לא קימות נפתח כשנצטרך...
        //אם נניח נצרכת המרה ברורה יות אז צריך לבדוק אייך עושים את זה...
        //כל אחת במקרה הספציפי שלה...
        //CreateMap<User, UserDto>().ReverseMap();
        //CreateMap<Bug, BugDto>().ReverseMap();
        //CreateMap<BugHistory, BugHistoryDto>().ReverseMap();
        //CreateMap<Comment, CommentDto>().ReverseMap();
        //CreateMap<Attachment, AttachmentDto>().ReverseMap();
    }
}
