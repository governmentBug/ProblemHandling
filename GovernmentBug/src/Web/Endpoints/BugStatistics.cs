
using GovernmentBug.Application.Bugs.Queries.GetBugsList;
using GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByMonth;
using GovernmentBug.Application.Bugs.Queries.GetBugStats.GetBugStatusByMonths;
using GovernmentBug.Application.Bugs.Queries.GetBugStats.GetTotalOpenBugs;
using GovernmentBug.Application.Bugs.Queries.GetBugStats.GetOpenBugsByPriority;
using GovernmentBug.Application.Bugs.Queries.GetAverageTreatmenTime;
using GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByStatus;
using GovernmentBug.Application.Bugs.Queries.GetBugStats.getByCategory;

namespace GovernmentBug.Web.Endpoints;

public class BugStatistics : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this).
          MapGet(GetByStatus, "bystatus")
         .MapGet(TotalOpenBugs, "totalopenbugs")
         .MapGet(GetBugs)
         .MapGet(AverageTreatmentTime, "averagetreatmenttime/{priorityId}/{categoryId}/{created}")
         .MapGet(GetOpenBugsByPriority, "openbugsbypriority")
         .MapGet(GetByMonths, "bymonth/{year}")
         .MapGet(GetByCategory, "bycategory");

    }
    public async Task<ByStatusDto> GetByStatus(ISender sender)
    {
        var result = await sender.Send(new GetByStatusQuery());
        return result;
    }
    public async Task<ByCategoryDto> GetByCategory(ISender sender)
    {
        var result = await sender.Send(new GetByCategoryQuery());
        return result;
    }
    public async Task<int> TotalOpenBugs(ISender sender)
    {
        var result = await sender.Send(new GetTotalOpenBugsQuery());
        return result;
    }
    public async Task<ByMonthsDto> GetByMonths(ISender sender, int? categoryId,int? userId, int year)
    {
        var result = await sender.Send(new GetByMonthsQuery(year,categoryId,userId));
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
    public async Task<OpenBugsByPriorityDto> GetOpenBugsByPriority(ISender sender)
    {
        var result = await sender.Send(new GetOpenBugsByPriorityQuery());
        return result;
    }
    public async Task<int> AverageTreatmentTime(ISender sender, int priorityId, int categoryId, DateTime created)
    {
        var result = await sender.Send(new AverageTreatmentTimeQuery(priorityId, categoryId, created));
        return (int)result;
    }
}
