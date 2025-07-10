using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using GovernmentBug.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;

namespace GovernmentBug.Infrastructure.Services;
public class SmtpMailSender : IMailSender
{
    private readonly IConfiguration _config;

    public SmtpMailSender(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        var smtpHost = _config["Smtp:Host"];
        var smtpPort = _config["Smtp:Port"];
        var smtpUser = _config["Smtp:Username"];
        var smtpPass = _config["Smtp:Password"];
        var fromEmail = _config["Smtp:From"];

        using var smtp = new SmtpClient(smtpHost)
        {
            Port = int.Parse(""+smtpPort),
            Credentials = new NetworkCredential(smtpUser, smtpPass),
            EnableSsl = true
        };

        var mail = new MailMessage(fromEmail+"", to, subject, htmlBody)
        {
            IsBodyHtml = true
        };

        await smtp.SendMailAsync(mail, cancellationToken);
    }
}

