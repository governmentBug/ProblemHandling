
using System.Security.Cryptography.X509Certificates;
using GovernmentBug.Application.Common.Models;
using GovernmentBug.Application.Priority.Commands.CreatePriority;
using GovernmentBug.Application.Priority.Queries.GetAllPriorities;
using GovernmentBug.Application.Priority.Queries.GetPriorityById;
using GovernmentBug.Application.Priority.Queries.GetPriorityByName;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GovernmentBug.Web.Endpoints;

public class Priority : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetAllPriorities)
            .MapGet(GetPriorityById, "/id/{id}")
            .MapGet(GetPriorityByName,"/name/{name}")  
            .MapPost(CreatePriority);
    }
    public async Task<List<PriorityDto>> GetAllPriorities(ISender sender)
    {
        return await sender.Send(new GetAllPrioritiesQuery());
    }

    public async Task<Created<int>> CreatePriority(ISender sender, CreatePriorityCommand command)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/api/priority/{id}", id);
    }
    public async Task<PriorityDto> GetPriorityById(ISender sender, int id)
    {
        return await sender.Send(new GetPriorityByIdQuery(id));
    }
    public async Task<PriorityDto> GetPriorityByName(ISender sender, string name)
    {
     return await sender.Send(new GetPriorityByNameQuery(name));
    }
}
