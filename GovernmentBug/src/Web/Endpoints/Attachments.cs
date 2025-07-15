using GovernmentBug.Application.Attachment.Command.CreateAttachment;
using GovernmentBug.Application.Attachment.NewFolder;
using GovernmentBug.Application.Attachment;
using GovernmentBug.Application.Bugs.Command.CreateBug;
using Microsoft.AspNetCore.Http.HttpResults;
using GovernmentBug.Application.Attachment.Queries.GetAttachmentBug;
using GovernmentBug.Application.Attachment.Command.DeleteAttachment;
using GovernmentBug.Application.Bugs.Commands.UpdateBug;
using Microsoft.AspNetCore.Mvc;

namespace GovernmentBug.Web.Endpoints;

public class Attachments : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            //.RequireAuthorization()
            .MapPost(CreateAttachments)
            .MapGet(GetAttachmentsByBugID, "{Id}")
            .MapDelete(DeleteAttachment, "{id}")
            .MapPost("create", async ([FromForm] CreateAttachmentCommandNew cmd, ISender sender) =>
             {
                 await sender.Send(cmd);
                 return Results.NoContent();
             }).DisableAntiforgery();
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
