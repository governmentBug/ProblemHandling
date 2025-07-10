using GovernmentBug.Domain.Enums;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Entities;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Mail;
using GovernmentBug.Application.Bugs.Queries.GetBugDetails;
using GovernmentBug.Application.Common.Models;

namespace GovernmentBug.Infrastructure.Services;

public class MailService : IMailService
{
    private readonly ILogger<MailService> _logger;
    private readonly IMailSender _mailSender;

    public MailService(ILogger<MailService> logger, IMailSender mailSender)
    {
        _logger = logger;
        _mailSender = mailSender;
    }

    public async Task SendBugNotificationEmailAsync(BugDto bug, BugNotificationType type, string? closedBy = null, string? notes = null, string? assignedTo = null, CancellationToken cancellationToken = default)
    {
        var (subject, body, toEmail) = GenerateEmailContent(bug, type, closedBy, notes, assignedTo);

        try
        {
            await _mailSender.SendEmailAsync(toEmail, subject, body, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "שגיאה בשליחת מייל מסוג {type}", type);
        }
    }

    private (string subject, string body, string to) GenerateEmailContent(BugDto bug, BugNotificationType type, string? closedBy, string? notes, string? assignedTo)
    {
        string subject = "";
        string body = "";
        string toEmail = "team@example.com";

        switch (type)
        {
            case BugNotificationType.Created:
                subject = $"נפתח באג חדש: {bug.Title}";
                body = $@"
                    <h3>🪲 באג חדש נפתח</h3>
                    <p><strong>כותרת:</strong> {bug.Title}</p>
                    <p><strong>תיאור:</strong> {bug.Description}</p>
                    <p><strong>נפתח ע״י:</strong> {bug.CreatedByUserFullName}</p>
                    <p><strong>תאריך פתיחה:</strong> {bug.Created:dd/MM/yyyy}</p>
                    <p><a href='https://your-system.com/bug/{bug.BugID}'>לצפייה בבאג</a></p>";
                toEmail = DetermineTeamEmail(bug); 
                break;
                //הערות הכוונה לקוממנטים????
            case BugNotificationType.Closed:
                subject = $"הבאג נסגר: {bug.Title}";
                body = $@"
                    <h3>✅ באג נסגר</h3>
                    <p><strong>כותרת:</strong> {bug.Title}</p>
                    <p><strong>נסגר ע״י:</strong> {closedBy}</p>
                    <p><strong>תאריך סגירה:</strong> {DateTime.Now:dd/MM/yyyy}</p>
                    {(string.IsNullOrWhiteSpace(notes) ? "" : $"<p><strong>הערות:</strong> {notes}</p>")}
                    <p><a href='https://your-system.com/bug/{bug.BugID}'>לצפייה בבאג</a></p>";
                toEmail = bug.User.Email;
                break;

            case BugNotificationType.AssignedToAzure:
                subject = $"באג {bug.Title} הועבר לטיפול ב-Azure ע״י {assignedTo}";
                body = $@"
                    <h3>🚀 באג הועבר ל-Azure</h3>
                    <p><strong>כותרת:</strong> {bug.Title}</p>
                    <p><strong>טיפול:</strong> {assignedTo}</p>
                    <p><a href='https://your-system.com/bug/{bug.BugID}'>לצפייה בבאג</a></p>";
                toEmail = bug.User.Email;
                break;
        }

        return (subject, body, toEmail);
    }

    private string DetermineTeamEmail(BugDto bug)
    {
        // פה בעזה ניצור את  הלוגיקה לפי קטגוריה / תעדוף / פרויקט
        return "team@example.com";
    }
}

