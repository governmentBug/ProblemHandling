using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Domain.Entities;
using GovernmentBug.Application.Common.Models;
using Microsoft.AspNetCore.Http;

namespace GovernmentBug.Application.Common.Services;
public class AttachmentConverter:IAttachmentConverter
{
    public async Task<Attachments> ConvertToAttachmentAsync(IFormFile file, int bugId, bool isFilm = false)
    {
        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);

        return new Attachments
        {
            BugId = bugId,
            FileName = file.FileName,
            FileType = file.ContentType,
            FilePath = memoryStream.ToArray(), 
        };
    }

}

