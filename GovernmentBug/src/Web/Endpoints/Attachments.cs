using System.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GovernmentBug.Application.Attachment;
using GovernmentBug.Application.Attachment.Command.CreateAttachment;
using GovernmentBug.Application.Attachment.Command.DeleteAttachment;
using GovernmentBug.Application.Attachment.NewFolder;
using GovernmentBug.Application.Attachment.Queries.GetAttachmentBug;
using GovernmentBug.Application.Bugs.Command.CreateBug;
using GovernmentBug.Application.Bugs.Commands.UpdateBug;
using GovernmentBug.Infrastructure.Data; // <-- תקן לפי namespace אמיתי של DbContext שלך

namespace GovernmentBug.Web.Endpoints;

public class Attachments : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        var group = app.MapGroup(this);
        group.MapPost(CreateAttachments);
        group.MapGet(GetAttachmentsByBugID, "{id}");
        group.MapDelete(DeleteAttachment, "{id}");
        group.MapPost("create", async ([FromForm] CreateAttachmentCommandNew cmd, ISender sender) =>
        {
            await sender.Send(cmd);
            return Results.NoContent();
        }).DisableAntiforgery();
        group.MapGet("list/{bugId:int}", async (
               int bugId,
               [FromServices] ApplicationDbContext db,
               CancellationToken ct) =>
        {
            var list = await db.Attachments
                .AsNoTracking()
                .Where(a => a.BugId == bugId)
                .Select(a => new AttachmentBugDto
                {
                    AttachmentId = a.AttachmentId,
                    BugId = a.BugId,
                    FileName = a.FileName,
                    FileType = a.FileType,
                    url = $"/attachments/download/{a.AttachmentId}"
                })
                .ToListAsync(ct);

            return Results.Ok(list);
        })
       .WithName("ListAttachmentsByBug")
       .Produces<List<AttachmentBugDto>>(StatusCodes.Status200OK)
       .Produces(StatusCodes.Status404NotFound);


        group.MapGet("download/{id:int}", async (
            int id,
            [FromServices] ApplicationDbContext db,
            HttpResponse resp,
            CancellationToken ct) =>
        {
            var cn = db.Database.GetDbConnection();
            await cn.OpenAsync(ct);

            await using var cmd = cn.CreateCommand();
            cmd.CommandText = @"SELECT FileName, FileType, FilePath FROM Attachments WHERE AttachmentId = @id";
            var p = cmd.CreateParameter();
            p.ParameterName = "@id";
            p.Value = id;
            cmd.Parameters.Add(p);

            await using var r = await cmd.ExecuteReaderAsync(ct);
            if (!await r.ReadAsync(ct))
                return Results.NotFound();

            string fileName = r.GetString(0);
            string mime = r.GetString(1);

            if (r.IsDBNull(2))
                return Results.NotFound();

            byte[] buffer = (byte[])r["FilePath"];
            if (buffer == null)
                return Results.NotFound();

            return Results.File(buffer, mime, fileName, enableRangeProcessing: true);
        })
        .DisableAntiforgery()
        .WithName("DownloadAttachment")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);

            }

    public async Task<Created<int>> CreateAttachments(ISender sender, CreateAttachmentCommand command)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/{nameof(Attachments)}/{id}", id);
    }

    public async Task<Ok<List<AttachmentBugDto>>> GetAttachmentsByBugID(ISender sender, int id)
    {
        var result = await sender.Send(new GetAttachmentBug(id));
        return TypedResults.Ok(result);
    }

    public async Task<NoContent> DeleteAttachment(ISender sender, int id)
    {
        await sender.Send(new DeleteAttachmentCommand(id));
        return TypedResults.NoContent();
    }
}
