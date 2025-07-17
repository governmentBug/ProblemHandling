using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace GovernmentBug.Application.Common.Models;
public class AttachmentUploadDto
{
    public int? AttachmentId { get; set; } 
    public IFormFile File { get; set; } = null!;
    public bool IsFilm { get; set; }
}

