using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GovernmentBug.Application.Attachment.Queries.GetAttachmentBug;
public class AttachmentBugDto
{
    public int AttachmentId { get; set; }
    public int BugId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    //public byte[] FilePath { get; set; } = Array.Empty<byte>();
    public string url { get; set; } = string.Empty;
}
