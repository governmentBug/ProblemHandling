using GovernmentBug.Application.Bugs.Command.CreateBug;
using GovernmentBug.Application.Bugs.Queries.GetBugsList;
using GovernmentBug.Application.Common.Models;
using GovernmentBug.Application.User.Command.CreateUser;
using GovernmentBug.Application.User.Queries.GetAllUsers;
using GovernmentBug.Application.User.Queries.GetUser;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GovernmentBug.Web.Endpoints;

public class Users : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            .MapGet(GetAllUsers)
            .MapGet(GetUserById,"/id/{id}")
            //.RequireAuthorization()
            .MapPost(CreateUsers);
    }

    public async Task<Created<int>> CreateUsers(ISender sender, CreateUserCommand command)
    {
        var id = await sender.Send(command);

        return TypedResults.Created($"/{nameof(Users)}/{id}", id);
    }
    public async Task<List<UserDto>> GetAllUsers(ISender sender)
    {
        var result = await sender.Send(new GetAllUsersQuery());
        return result;
    }
    public async Task<UserDto> GetUserById(ISender sender, int id)
    {
        var result = await sender.Send(new GetUserByIdQuery(id));
        return result;
    }

}
