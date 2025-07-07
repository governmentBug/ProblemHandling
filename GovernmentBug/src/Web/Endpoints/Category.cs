using GovernmentBug.Application.Category.Commands.CreateCategory;
using GovernmentBug.Application.Category.Queries.GetAllCategories;
using GovernmentBug.Application.Category.Queries.GetCategoryById;
using GovernmentBug.Application.Category.Queries.GetCategoryByName;
using GovernmentBug.Application.Common.Models;
using GovernmentBug.Application.Priority.Queries.GetPriorityByName;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GovernmentBug.Web.Endpoints;

public class Category : EndpointGroupBase
{
    public override void Map(WebApplication app)
    {
        app.MapGroup(this)
            //.RequireAuthorization()
            .MapGet(GetCategoryByName, "/name/{name}")
            .MapGet(GetCategoryById,"/id/{id}")
            .MapGet(GetAllCategories)
            .MapPost(CreateCategory);
    }
    public async Task<CategoryDto> GetCategoryByName(ISender sender, string name)
    {
        var result = await sender.Send(new GetCategoryByNameQuery(name));
        return result;
    }
    public async Task<List<CategoryDto>> GetAllCategories(ISender sender)
    {
        return await sender.Send(new GetAllCategoriesQuery());
    }
    public async Task<CategoryDto> GetCategoryById(ISender sender, int id)
    {
        return await sender.Send(new GetCategoryByIdQuery(id));
    }
    public async Task<Created<int>> CreateCategory(ISender sender, CreateCategoryCommand command)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/api/category/{id}", id);
    }

}

