using GovernmentBug.Application.Common.Models;
using GovernmentBug.Application.Status.Commands.CreateStatus;
using GovernmentBug.Application.Status.Queries.GeAlltStatuses;
using GovernmentBug.Application.Status.Queries.GetStatusById;
using GovernmentBug.Application.Status.Queries.GetStatusByName;
using GovernmentBug.Web.Infrastructure;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GovernmentBug.Web.Endpoints;

public class Status : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetAllStatuses)
            .MapGet(GetStatusByName, "/name/{name}")
            .MapGet(GetStatusById, "/id/{id}")
            .MapPost(CreateStatus);
    }
    public async Task<List<StatusDto>> GetAllStatuses(ISender sender)
    {
        var result = await sender.Send(new GetAllStatusesQuery());
        return result;
    }
    public async Task<StatusDto> GetStatusById(ISender sender, int id)
    {
        var result = await sender.Send(new GetStatusByIdQuery(id));
        return result;
    }
    public async Task<StatusDto> GetStatusByName(ISender sender, string name)
    {
        var result = await sender.Send(new GetStatusByNameQuery(name));
        return result;
    }
    public async Task<Created<StatusDto>> CreateStatus(ISender sender, CreateStatusCommand command)
    {
        var statusDto = await sender.Send(command);
        return TypedResults.Created($"/api/status/id/{statusDto.Id}", statusDto);
    }
}
