using ActindoMiddleware.Application.Monitoring;
using ActindoMiddleware.Application.Services;
using ActindoMiddleware.Infrastructure.Actindo;
using ActindoMiddleware.Infrastructure.Actindo.Auth;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.Configure<ActindoOAuthOptions>(
    builder.Configuration.GetSection("ActindoOAuth"));

builder.Services.AddSingleton<IActindoAvailabilityTracker, ActindoAvailabilityTracker>();
builder.Services.AddHttpClient<IAuthenticationService, AuthenticationService>();
builder.Services.AddHttpClient<ActindoClient>();
builder.Services.AddSingleton<IDashboardMetricsService, DashboardMetricsService>();
builder.Services.AddScoped<ProductCreateService>();
builder.Services.AddScoped<ProductSaveService>();
builder.Services.AddScoped<CustomerCreateService>();
builder.Services.AddScoped<CustomerSaveService>();
builder.Services.AddScoped<TransactionService>();
builder.Services.AddScoped<ProductImageService>();
builder.Services.AddScoped<IJobReplayService, JobReplayService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();

app.Run();
