using GovernmentBug.Application.Bugs.Command.CreateBug;
using GovernmentBug.Application.Bugs.Command.DeleteBug;
using GovernmentBug.Application.Bugs.Commands.UpdateBug;
using GovernmentBug.Application.Bugs.Queries.GetBugDetails;
using GovernmentBug.Application.Comments.Commands.CreateComment;
using GovernmentBug.Application.Comments.Commands.UpdateComment;
using GovernmentBug.Application.Comments.Queires.GetCommentsBug;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GovernmentBug.Web.Endpoints;

public class Comments: EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            //.RequireAuthorization()
            .MapPost(CreateComment)
            .MapGet(GetCommentsByBugID)
            .MapPut(UpdateComment,"{id}")
            .MapDelete(DeleteComment, "{id}");
            
    }



    public async Task<Created<int>> CreateComment(ISender sender, CreateCommentCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/{nameof(Comments)}/{id}", id);
    }
    public async Task<Ok<List<CommentsBugDto>>> GetCommentsByBugID(ISender sender, int id)
    {
        var result = await sender.Send(new GetCommentsBug(id));

        return TypedResults.Ok(result);
    }
    public async Task<Results<NoContent, BadRequest>> UpdateComment(ISender sender, int id, UpdateCommentCommand command)
    {
        if (id != command.commentId) return TypedResults.BadRequest();

        await sender.Send(command);

        return TypedResults.NoContent();
    }


    public async Task<NoContent> DeleteComment(ISender sender, int id)
    {
        await sender.Send(new DeleteBugCommand(id));

        return TypedResults.NoContent();
    }

}
