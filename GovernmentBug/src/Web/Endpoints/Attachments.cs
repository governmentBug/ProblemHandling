using GovernmentBug.Application.Attachment.Command.CreateAttachment;
using GovernmentBug.Application.Bugs.Command.CreateBug;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GovernmentBug.Web.Endpoints;

public class Attachments : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            //.RequireAuthorization()
            .MapPost(CreateAttachments);
    }
     
    public async Task<Created<int>> CreateAttachments(ISender sender, CreateAttachmentCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/{nameof(Attachments)}/{id}", id);
    }
}
