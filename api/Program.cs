using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using OperacaoCuriosidadeAPI.Features.AdminFeatures.Commands;
using OperacaoCuriosidadeAPI.Features.AdminFeatures.Handlers;
using OperacaoCuriosidadeAPI.Features.AdminFeatures.Queries;
using OperacaoCuriosidadeAPI.Features.DashboardFeatures.Handlers;
using OperacaoCuriosidadeAPI.Features.DashboardFeatures.Queries;
using OperacaoCuriosidadeAPI.Features.LoginFeatures.Commands;
using OperacaoCuriosidadeAPI.Features.LoginFeatures.Handlers;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Handlers;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;
using OperacaoCuriosidadeAPI.Identity;
using OperacaoCuriosidadeAPI.Notifications;
using OperacaoCuriosidadeAPI.Repositories;
using OperacaoCuriosidadeAPI.Swagger;
using OperacaoCuriosidadeAPI.Validators;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey
            (Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]!)),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Administrador", policy =>
        policy.RequireRole(IdentityData.RoleAdministrador));
    options.AddPolicy("Colaborador", policy =>
        policy.RequireRole(IdentityData.RoleColaborador));
    options.AddPolicy(IdentityData.RoleAdminColab, policy =>
        policy.RequireRole(IdentityData.RoleColaborador, IdentityData.RoleAdministrador));
});
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();

builder.Services.AddScoped<NotificationContext>();
builder.Services.AddScoped<UserValidator>();
builder.Services.AddScoped<AdminValidator>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAdminRepository, AdminRepository>();

builder.Services.AddScoped<ICreateUserHandler, CreateUserHandler>();
builder.Services.AddScoped<IUpdateUserHandler, UpdateUserHandler>();
builder.Services.AddScoped<IDeleteUserHandler, DeleteUserHandler>();
builder.Services.AddScoped<IGetAllUsersHandler, GetAllUsersHandler>();
builder.Services.AddScoped<IGetUserByIdHandler, GetUserByIdHandler>();

builder.Services.AddScoped<ICreateAdminHandler, CreateAdminHandler>();
builder.Services.AddScoped<IGetCurrentAdminInfoHandler, GetCurrentAdminHandler>();

builder.Services.AddScoped<ILoginHandler, LoginHandler>();

builder.Services.AddScoped<IGetCadastrosUltimos30DiasHandler, GetCadastrosUltimos30DiasHandler>();
builder.Services.AddScoped<IGetPendenciaRevisadosHandler, GetPendenciaRevisadosHandler>();
builder.Services.AddScoped<IGetTotalCadastrosHandler, GetTotalCadastrosHandler>();


var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
