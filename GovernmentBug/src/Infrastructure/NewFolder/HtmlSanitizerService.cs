using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ganss.Xss;
using GovernmentBug.Application.Common.Interfaces;

namespace GovernmentBug.Infrastructure.NewFolder;
public class HtmlSanitizerService: IHtmlSanitizerService
{
    private readonly IHtmlSanitizer _sanitizer;

    public HtmlSanitizerService(IHtmlSanitizer sanitizer)
    {
        _sanitizer = sanitizer;
    }


    public string Sanitize(string html)
    {
        return _sanitizer.Sanitize(html);
    }
}
