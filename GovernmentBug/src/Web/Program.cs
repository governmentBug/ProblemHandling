using GovernmentBug.Application.Common.Mappings;
using GovernmentBug.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// 🟡 שלב 1: הגדרת מדיניות CORS
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("https://localhost:44447") // כתובת Angular
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// הוספת שירותים
builder.AddKeyVaultIfConfigured();
builder.AddApplicationServices();
builder.AddInfrastructureServices();
builder.AddWebServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    //await app.InitialiseDatabaseAsync();
}
else
{
    app.UseHsts();
}

app.UseHealthChecks("/health");
app.UseHttpsRedirection();
app.UseStaticFiles();

// 🟢 שלב 2: הפעלת המדיניות
app.UseCors(MyAllowSpecificOrigins);

app.UseSwaggerUi(settings =>
{
    settings.Path = "/api";
    settings.DocumentPath = "/api/specification.json";
});

app.MapRazorPages();
app.MapFallbackToFile("index.html");

app.UseExceptionHandler(options => { });

app.MapEndpoints();

app.Run();

public partial class Program { }
