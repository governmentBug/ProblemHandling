using GovernmentBug.Application.Bugs.Command.CreateBug;
using GovernmentBug.Application.Bugs.Command.DeleteBug;
using GovernmentBug.Application.Bugs.Commands.UpdateBug;
using GovernmentBug.Application.Bugs.Queries.BugComparison;
using GovernmentBug.Application.Bugs.Queries.GetBugDetails;
using GovernmentBug.Application.Bugs.Queries.GetBugsList;
using GovernmentBug.Application.Bugs.Queries.GetBugStats.GetBugStatusByMonths;
using GovernmentBug.Application.Bugs.Queries.GetBugStats.GetByMonth;
using GovernmentBug.Application.Common.Models;
using GovernmentBug.Application.TodoItems.Commands.CreateTodoItem;
using GovernmentBug.Application.TodoItems.Commands.DeleteTodoItem;
using GovernmentBug.Application.TodoItems.Commands.UpdateTodoItem;
using GovernmentBug.Application.TodoItems.Commands.UpdateTodoItemDetail;
using GovernmentBug.Application.TodoItems.Queries.GetTodoItemsWithPagination;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GovernmentBug.Web.Endpoints;

public class Bugs :EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            //.RequireAuthorization()
            .MapPost(CreateBug)
            .MapGet(GetBugDetialsByID, "{id}")
            .MapPut(UpdateBug, "{id}")
            .MapDelete(DeleteBug, "{id}")
            .MapGet(GetAllBugDetials, "all")
            .MapGet(IdentifyingRecurringBugs, "compare");

    }



    public async Task<Created<int>> CreateBug(ISender sender, CreateBugCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/{nameof(Bugs)}/{id}", id);
    }

    public async Task<Ok<BugDetalsDto>> GetBugDetialsByID(ISender sender,int id)
    {
        var result = await sender.Send(new GetBugDetailsQuery(id));

        return TypedResults.Ok(result);
    }
    public async Task<Results<NoContent, BadRequest>> UpdateBug(ISender sender, int id, UpdateBugCommand command)
    {
        if (id != command.BugId) return TypedResults.BadRequest();

        await sender.Send(command);

        return TypedResults.NoContent();
    }


    public async Task<NoContent> DeleteBug(ISender sender, int id)
    {
        await sender.Send(new DeleteBugCommand(id));

        return TypedResults.NoContent();
    }

    public async Task<Ok<List<BugDetalsDto>>> GetAllBugDetials(ISender sender)
    {
        var result = await sender.Send(new GetBugDetails());
        return TypedResults.Ok(result);
    }
    public async Task<List<BugSummariesDto>> IdentifyingRecurringBugs(ISender sender, BugComprisonDto bugComprisonDto)
    {
        var result = await sender.Send(new BugComparisonQuery(bugComprisonDto));
        return result;
    }
}

