
using GovernmentBug.Application.Bugs.Queries.GetBugsList;
using GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByMonth;
using GovernmentBug.Application.Bugs.Queries.GetBugStats.GetBugStatusByMonths;
using Microsoft.AspNetCore.Http.HttpResults;
using GovernmentBug.Application.Bugs.Queries.GetBugStats.GetTotalOpenBugs;

namespace GovernmentBug.Web.Endpoints;

public class BugStatistics : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
         .MapGet(TotalOpenBugs, "totalopenbugs")
         .MapGet(GetBugs)
         .MapGet(GetBugsByMonths, "bymonth/{year}")
         .MapGet(GetBugStatusByMonths, "openbugsstatus/{month}/{year}");

    }
    public async Task<int> TotalOpenBugs(ISender sender)
    {
        var result = await sender.Send(new GetTotalOpenBugsQuery());
        return result;
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
    public async Task<BugStatusByMonthsDTO> GetBugStatusByMonths(ISender sender, int month, int year)
    {
        var result = await sender.Send(new GetBugsStatsQuery(month,year));
        return result;
    }
}
