using GovernmentBug.Application.Bugs.Queries.GetBugs;
using GovernmentBug.Application.Common.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GovernmentBug.Web.Endpoints;

public class Bugs :EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .RequireAuthorization()
            .MapGet(GetBugs);
    }

    public async Task<Ok<List<BugDto>>> GetBugs(ISender sender)
    {
        var result = await sender.Send(new GetBugsQuery());

        return TypedResults.Ok(result);
    }
}
