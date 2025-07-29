using GovernmentBug.Domain.Entities;

namespace GovernmentBug.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<TodoList> TodoLists { get; }

    DbSet<TodoItem> TodoItems { get; }
    DbSet<Attachments> Attachments { get; }
    DbSet<BugHistory> BugHistories { get; }
    DbSet<Bug> Bugs { get; }
    DbSet<Comment> Comments { get; }
    DbSet<Users> AppUsers { get; }
    DbSet<Domain.Entities.Priority> Priorities { get; }
    DbSet<Domain.Entities.Status> Statuses { get; }
    DbSet<Domain.Entities.Category> Categories { get; }
    DbSet<CommentMention> CommentMentions { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
