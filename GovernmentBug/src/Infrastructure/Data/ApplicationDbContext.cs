using System.Reflection;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Entities;
using GovernmentBug.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GovernmentBug.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<TodoList> TodoLists => Set<TodoList>();

    public DbSet<TodoItem> TodoItems => Set<TodoItem>();
    public DbSet<Attachment> Attachments => Set<Attachment>();
    public DbSet<BugHistory> BugHistories => Set<BugHistory>();
    public DbSet<Bug> Bugs => Set<Bug>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Users> AppUsers=> Set<Users>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
