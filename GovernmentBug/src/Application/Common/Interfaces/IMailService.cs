using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Models;
using GovernmentBug.Domain.Entities;
using GovernmentBug.Domain.Enums;

namespace GovernmentBug.Application.Common.Interfaces;
public interface IMailService
{
    Task SendBugNotificationEmailAsync(BugDto bug, BugNotificationType type, string? closedBy = null, string? notes = null, string? assignedTo = null, CancellationToken cancellationToken = default);
}
