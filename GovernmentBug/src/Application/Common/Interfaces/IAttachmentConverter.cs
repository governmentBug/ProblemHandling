using Microsoft.AspNetCore.Http;
using GovernmentBug.Domain.Entities;
using GovernmentBug.Application.Common.Models;

public interface IAttachmentConverter
{
    Task<Attachments> ConvertToAttachmentAsync(IFormFile file, int bugId, bool isFilm = false);
}
