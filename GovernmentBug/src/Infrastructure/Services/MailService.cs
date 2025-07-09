using GovernmentBug.Domain.Enums;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Domain.Entities;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Mail;

namespace GovernmentBug.Infrastructure.Services;

public class MailService : IMailService
{
    private readonly ILogger<MailService> _logger;

    public MailService(ILogger<MailService> logger)
    {
        _logger = logger;
    }

    public async Task SendBugNotificationEmailAsync(Bug bug, BugNotificationType type, string? closedBy = null, string? notes = null, string? assignedTo = null, CancellationToken cancellationToken = default)
    {
        string subject = "";
        string body = "";
        string toEmail = "team@example.com"; // תחליפי בהתאם ל־bug.CategoryId / bug.PriorityId וכו'

        switch (type)
        {
            case BugNotificationType.Created:
                subject = $"נפתח באג חדש: {bug.Title}";
                body = $@"
                <h3>🪲 באג חדש נפתח</h3>
                <p><strong>כותרת:</strong> {bug.Title}</p>
                <p><strong>תיאור:</strong> {bug.Description}</p>
                <p><strong>נפתח ע״י:</strong> משתמש #{bug.CreatedByUserId}</p>
                <p><strong>תאריך פתיחה:</strong> {bug.Created}</p>
                <p><a href='https://your-system.com/bug/{bug.BugID}'>לצפייה בבאג</a></p>";
                break;

            case BugNotificationType.Closed:
                subject = $"הבאג נסגר: {bug.Title}";
                body = $@"
                <h3>✅ באג נסגר</h3>
                <p><strong>כותרת:</strong> {bug.Title}</p>
                <p><strong>נסגר ע״י:</strong> {closedBy}</p>
                <p><strong>תאריך סגירה:</strong> {DateTime.Now}</p>
                {(string.IsNullOrWhiteSpace(notes) ? "" : $"<p><strong>הערות:</strong> {notes}</p>")}
                <p><a href='https://your-system.com/bug/{bug.BugID}'>לצפייה בבאג</a></p>";
                break;

            case BugNotificationType.AssignedToAzure:
                toEmail = "reporter@example.com"; // אפשר לשים bug.CreatedBy.Email
                subject = $"באג {bug.Title} הועבר לטיפול ב-Azure ע״י {assignedTo}";
                body = $@"
                <h3>🚀 באג הועבר ל-Azure</h3>
                <p><strong>כותרת:</strong> {bug.Title}</p>
                <p><strong>טיפול:</strong> {assignedTo}</p>
                <p><a href='https://your-system.com/bug/{bug.BugID}'>לצפייה בבאג</a></p>";
                break;
        }

        try
        {
            using var smtp = new SmtpClient("mail.yourdomain.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("no-reply@yourdomain.com", "password"),
                EnableSsl = true,
            };

            var mail = new MailMessage("no-reply@yourdomain.com", toEmail, subject, body);
            mail.IsBodyHtml = true;
            await smtp.SendMailAsync(mail, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "שגיאה בשליחת מייל מסוג {type}", type);
        }
    }

}
