using System.Security.Claims;
using ActindoMiddleware.Application.Monitoring;
using ActindoMiddleware.Application.Configuration;
using ActindoMiddleware.Application.Security;
using ActindoMiddleware.Application.Services;
using ActindoMiddleware.Infrastructure.Actindo;
using ActindoMiddleware.Infrastructure.Actindo.Auth;
using ActindoMiddleware.Infrastructure.Configuration;
using ActindoMiddleware.Infrastructure.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.Configure<ActindoOAuthOptions>(
    builder.Configuration.GetSection("ActindoOAuth"));

builder.Services.AddSingleton<IUserStore, SqliteUserStore>();
builder.Services.AddSingleton<ISettingsStore, SqliteSettingsStore>();
builder.Services.AddSingleton<IActindoEndpointProvider, ActindoEndpointProvider>();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/login.html";
        options.Cookie.Name = "actindo.middleware.auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = TimeSpan.FromDays(7);
        options.Events.OnRedirectToLogin = context =>
        {
            if (context.Request.Path.StartsWithSegments("/dashboard") ||
                context.Request.Path.StartsWithSegments("/api/actindo") ||
                context.Request.Path.StartsWithSegments("/users") ||
                context.Request.Path.StartsWithSegments("/settings") ||
                context.Request.Path.StartsWithSegments("/registrations") ||
                context.Request.Path.StartsWithSegments("/auth"))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            }

            context.Response.Redirect(context.RedirectUri);
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    })
    .AddScheme<StaticBearerOptions, StaticBearerAuthenticationHandler>(
        StaticBearerDefaults.AuthenticationScheme,
        options =>
        {
            builder.Configuration.GetSection("StaticBearer").Bind(options);
        });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AuthPolicies.Read, policy =>
        policy.AddAuthenticationSchemes(
                CookieAuthenticationDefaults.AuthenticationScheme,
                StaticBearerDefaults.AuthenticationScheme)
            .RequireAuthenticatedUser()
            .RequireRole(UserRole.Read, UserRole.Write, UserRole.Admin));
    options.AddPolicy(AuthPolicies.Write, policy =>
        policy.AddAuthenticationSchemes(
                CookieAuthenticationDefaults.AuthenticationScheme,
                StaticBearerDefaults.AuthenticationScheme)
            .RequireAuthenticatedUser()
            .RequireRole(UserRole.Write, UserRole.Admin));
    options.AddPolicy(AuthPolicies.Admin, policy =>
        policy.AddAuthenticationSchemes(
                CookieAuthenticationDefaults.AuthenticationScheme,
                StaticBearerDefaults.AuthenticationScheme)
            .RequireAuthenticatedUser()
            .RequireRole(UserRole.Admin));
});

builder.Services.AddSingleton<IActindoAvailabilityTracker, ActindoAvailabilityTracker>();
builder.Services.AddHttpClient<ActindoMiddleware.Infrastructure.Actindo.Auth.IAuthenticationService, ActindoMiddleware.Infrastructure.Actindo.Auth.AuthenticationService>();
builder.Services.AddHttpClient<ActindoClient>();
builder.Services.AddHttpClient<ActindoProductListService>();
builder.Services.AddSingleton<IDashboardMetricsService, DashboardMetricsService>();
builder.Services.AddScoped<ProductCreateService>();
builder.Services.AddScoped<ProductSaveService>();
builder.Services.AddScoped<CustomerCreateService>();
builder.Services.AddScoped<CustomerSaveService>();
builder.Services.AddScoped<TransactionService>();
builder.Services.AddScoped<ProductImageService>();
builder.Services.AddScoped<IJobReplayService, JobReplayService>();
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value ?? string.Empty;
    var isPublic =
        path.StartsWith("/login", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/register", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/auth", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/styles.css", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/dashboard.js", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/login.js", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/register.js", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/settings.js", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/products.js", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/customers.js", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/users.js", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/favicon", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/_framework", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/openapi", StringComparison.OrdinalIgnoreCase);

    if (!isPublic &&
        (path.Equals("/", StringComparison.OrdinalIgnoreCase) ||
         path.EndsWith(".html", StringComparison.OrdinalIgnoreCase)))
    {
        if (context.User?.Identity?.IsAuthenticated != true)
        {
            context.Response.Redirect($"/login.html?returnUrl={Uri.EscapeDataString(path == "/" ? "/" : path)}");
            return;
        }
    }

    await next();
});

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

app.Run();
