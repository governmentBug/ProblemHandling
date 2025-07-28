using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Application.Common.Services;
public class MentionService : IMentionService
{
    private readonly IHtmlSanitizerService _sanitizer;

    public MentionService(IHtmlSanitizerService sanitizer)
    {
        _sanitizer = sanitizer;
    }
    public string CleanHtml(string rawHtml)
    {
        return _sanitizer.Sanitize(rawHtml);
    }

    public Task SendMentionEmailsAsync(List<int> userIds, string commentContent, int bugId)
    {
        throw new NotImplementedException();
    }
}
