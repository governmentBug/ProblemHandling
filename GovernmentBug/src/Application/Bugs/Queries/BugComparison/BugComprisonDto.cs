using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Application.Bugs.Queries.BugComparison
{
    public class BugComprisonDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<AttachmentDto> Attachments { get; set; } = new();
    }
}
