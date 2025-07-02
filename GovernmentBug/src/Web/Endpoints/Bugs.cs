using GovernmentBug.Application.Bugs.Command.CreateBug;
using GovernmentBug.Application.Bugs.Queries.GetBugsList;
using GovernmentBug.Application.TodoItems.Commands.CreateTodoItem;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GovernmentBug.Web.Endpoints;

public class Bugs :EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            //.RequireAuthorization()
            .MapGet(GetBugs)
            .MapPost(CreateBug);
    }


    public async Task<Ok<List<BugSummariesDto>>> GetBugs(ISender sender)
    {
        var result = await sender.Send(new GetBugSummaries());

        return TypedResults.Ok(result);
    }
    public async Task<Created<int>> CreateBug(ISender sender, CreateBugCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/{nameof(Bugs)}/{id}", id);
    }

}
