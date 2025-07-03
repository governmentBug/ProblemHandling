
using GovernmentBug.Application.Bugs.Queries.GetBugsList;
using GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByMonth;
using GovernmentBug.Application.Bugs.Queries.GetBugStats.GetOpenBugsByStatus;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GovernmentBug.Web.Endpoints;

public class BugStatistics : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
         .MapGet(GetBugs)
         .MapGet(GetBugsByMonths, "bymonth/{year}")
          .MapGet(GetOpenBugsStatus, "openbugsstatus");

    }
    public async Task<ByMonthsDto> GetBugsByMonths(ISender sender, int year)
    {
        var result = await sender.Send(new GetByMonthsQuery(year));
        return result;
    }
    public async Task<List<BugSummariesDto>> GetBugs(ISender sender)
    {
        var result = await sender.Send(new GetBugSummaries());

        return result;
    }
    public async Task<OpenBugsByStatusDto> GetOpenBugsStatus(ISender sender)
    {
        var result = await sender.Send(new GetBugsStatsQuery());
        return result;
    }
}
