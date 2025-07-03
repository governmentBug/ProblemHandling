using GovernmentBug.Domain.Common;
using GovernmentBug.Domain.Entities;

namespace GovernmentBug.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<TodoList> TodoLists { get; }

    DbSet<TodoItem> TodoItems { get; }
    DbSet<Attachment> Attachments { get; }
    DbSet<BugHistory> BugHistories { get; }
    DbSet<Bug> Bugs { get; }
    DbSet<Comment> Comments { get; }
    DbSet<Users> AppUsers { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
