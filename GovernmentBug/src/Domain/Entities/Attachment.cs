using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualBasic.FileIO;

namespace GovernmentBug.Domain.Entities
{
    public class Attachments : BaseAuditableEntity
    {
       
        [Key]
        public int AttachmentId { get; set; }
        public int BugId { get; set; }

        [MaxLength(255)]
        public virtual Bug Bug { get; set; } = null!;
        public string FileName { get; set; } = string.Empty;

        [MaxLength(50)]
        public string FileType { get; set; } = string.Empty;

        public byte[] FilePath { get; set; } = Array.Empty<byte>();

    }
}
