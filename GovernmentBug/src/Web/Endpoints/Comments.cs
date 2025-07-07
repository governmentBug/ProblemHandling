using GovernmentBug.Application.Bugs.Command.CreateBug;
using GovernmentBug.Application.Bugs.Command.DeleteBug;
using GovernmentBug.Application.Bugs.Commands.UpdateBug;
using GovernmentBug.Application.Bugs.Queries.GetBugDetails;
using GovernmentBug.Application.Comments.Commands.CreateComment;
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
            .MapGet(GetCommentsByBugID);
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


}
