using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Common.Services;
public class MentionService : IMentionService
{
    public Task SendMentionEmailsAsync(List<int> userIds, string commentContent, int bugId)
    {
        throw new NotImplementedException();
    }
}
