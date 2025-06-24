using GovernmentBug.Domain.Events;
using Microsoft.Extensions.Logging;

namespace GovernmentBug.Application.TodoItems.EventHandlers;

public class TodoItemCreatedEventHandler : INotificationHandler<TodoItemCreatedEvent>
{
    private readonly ILogger<TodoItemCreatedEventHandler> _logger;

    public TodoItemCreatedEventHandler(ILogger<TodoItemCreatedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(TodoItemCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("GovernmentBug Domain Event: {DomainEvent}", notification.GetType().Name);

        return Task.CompletedTask;
    }
}
