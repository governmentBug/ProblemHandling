using GovernmentBug.Application.Bugs.Queries.GetBugsList;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GovernmentBug.Web.Endpoints;

public class Bugs : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetBugs);
    }

    public async Task<Ok<List<BugListDto>>> GetBugs(ISender sender)
    {
        var result = await sender.Send(new GetBugsQuery());

        return TypedResults.Ok(result);
    }
}
