using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Bugs.Command.CreateBug;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Models;
using GovernmentBug.Application.TodoItems.Commands.CreateTodoItem;
using GovernmentBug.Domain.Entities;
using GovernmentBug.Domain.Enums;
using GovernmentBug.Domain.Events;

namespace GovernmentBug.Application.Bugs.Command.CreateBug;
public record CreateBugCommand : IRequest<int>
{
    public int BugID { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string PriortyId { get; set; } = string.Empty;

    public int CreatedByUserId { get; set; }

    public DateTime CreatedDate { get; set; }

    public StatusBug Status { get; set; }

    //public virtual User CreatedByUser { get; set; } = null!;

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();

}

public class CreateBugCommandHandler : IRequestHandler<CreateBugCommand, int>
{
    public int BugID { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string PriortyId { get; set; } = string.Empty;

    public int CreatedByUserId { get; set; }

    public DateTime CreatedDate { get; set; }

    public StatusBug Status { get; set; }

    //public virtual User CreatedByUser { get; set; } = null!;

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();

}

public class CreateBugCommandHandler : IRequestHandler<CreateBugCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateBugCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateBugCommand request, CancellationToken cancellationToken)
    {
        var entity = new Bug
        {
            BugID = request.BugID,
            Title = request.Title,
            Description = request.Description,
            PriortyId = request.PriortyId,
            CreatedByUserId = request.CreatedByUserId,
            CreatedDate = request.CreatedDate,
            Comments = request.Comments,
            StatusId = request.Status
            //CreatedByUser = request.CreatedByUser,
            StatusId = request.Status
        };


    entity.AddDomainEvent(new TodoBugCreatedEvent(entity));

        _context.Bugs.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.BugID;
    }
}
