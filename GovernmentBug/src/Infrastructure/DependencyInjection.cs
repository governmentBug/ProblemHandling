using Ganss.Xss;
using GovernmentBug.Application.Common.Interfaces;
using GovernmentBug.Application.Common.Services;
using GovernmentBug.Domain.Constants;
using GovernmentBug.Infrastructure.Data;
using GovernmentBug.Infrastructure.Data.Interceptors;
using GovernmentBug.Infrastructure.Identity;
using GovernmentBug.Infrastructure.NewFolder;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace Microsoft.Extensions.DependencyInjection;

public static class DependencyInjection
{
    public static void AddInfrastructureServices(this IHostApplicationBuilder builder)
    {
        var connectionString = builder.Configuration.GetConnectionString("GovernmentBugDb");
        Guard.Against.Null(connectionString, message: "Connection string 'GovernmentBugDb' not found.");

        builder.Services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        builder.Services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();
        builder.Services.AddScoped<IHtmlSanitizerService, HtmlSanitizerService>();

        builder.Services.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
            options.UseSqlServer(connectionString);
            //.AddAsyncSeeding(sp);
        });

        builder.Services.AddScoped<IBugHistoryService, BugHistoryService>();
        builder.Services.AddScoped<IAttachmentConverter, AttachmentConverter>();

        builder.Services.AddScoped<IMentionService, MentionService>();
        builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());

        builder.Services.AddScoped<ApplicationDbContextInitialiser>();

        builder.Services
            .AddDefaultIdentity<ApplicationUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        builder.Services.AddSingleton(TimeProvider.System);
        builder.Services.AddTransient<IIdentityService, IdentityService>();

        builder.Services.AddSingleton<IHtmlSanitizer>(provider =>
        {
            var sanitizer = new HtmlSanitizer();

            // תגיות שמותרות
            sanitizer.AllowedTags.Add("p");
            sanitizer.AllowedTags.Add("span");
            sanitizer.AllowedTags.Add("a");

            // תכונות שמותרות
            sanitizer.AllowedAttributes.Add("class");
            sanitizer.AllowedAttributes.Add("contenteditable");
            sanitizer.AllowedAttributes.Add("href");
            sanitizer.AllowedAttributes.Add("target");
            sanitizer.AllowedAttributes.Add("rel");

            sanitizer.AllowedAttributes.Add("data-id");
            sanitizer.AllowedAttributes.Add("data-value");
            sanitizer.AllowedAttributes.Add("data-link");
            sanitizer.AllowedAttributes.Add("data-index");
            sanitizer.AllowedAttributes.Add("data-denotation-char"); // ← זה הנכון

            // אם נדרש, גם סגנון פנימי
            sanitizer.AllowedAttributes.Add("style");

            // תוספות חשובות
            sanitizer.AllowDataAttributes = true;
            sanitizer.KeepChildNodes = true;

            // הקלאס החשוב שלך
            sanitizer.AllowedClasses.Add("mention");

            return sanitizer;
        });



    }
}
