using System;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Entities;
using GovernmentBug.Domain.Events;

namespace GovernmentBug.Application.User.Command.CreateUser;
public class CreateUserCommand : IRequest<int>
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;

}

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var entity = new Users
        {
            UserId = request.UserId,
            FullName = request.FullName,
            Email = request.Email,
            Role = request.Role
        };


        entity.AddDomainEvent(new TodoUserCreatedEvent(entity));

        _context.AppUsers.Add(entity);

        await _context.SaveChangesAsync(cancellationToken);

        return entity.UserId;
    }
}
