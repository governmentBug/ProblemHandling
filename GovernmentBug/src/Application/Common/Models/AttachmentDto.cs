using System;
using AutoMapper; // ודא שאתה מוסיף את ה-using הנכון
using Microsoft.EntityFrameworkCore; // עבור AsNoTracking
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace GovernmentBug.Application.Common.Models
{
    public class AttachmentDto
    {
        public int AttachmentId { get; set; }
        public int BugId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
    }

}
