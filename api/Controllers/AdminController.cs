using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OperacaoCuriosidadeAPI.Common;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Features.AdminFeatures.Commands;
using OperacaoCuriosidadeAPI.Features.AdminFeatures.Queries;
using OperacaoCuriosidadeAPI.Identity;
using OperacaoCuriosidadeAPI.Notifications;
using System.Security.Claims;

namespace OperacaoCuriosidadeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly IDispatcher _dispatcher;
    private readonly NotificationContext _notificationContext; 

    public AdminController(
        IDispatcher dispatcher,
        NotificationContext notificationContext)
    {
        _dispatcher = dispatcher;
        _notificationContext = notificationContext;
    }

    [HttpPost("create")]
    [Authorize(Policy = "Administrador")]
    public async Task<IActionResult> Create(AdminDTO dto)
    {
        var command = new CreateAdminCommand(dto);
        var createdAdmin = await _dispatcher.SendAsync(command);

        if(_notificationContext.HasNotifications)
        {
            return _notificationContext.Notifications.Any(n => n.Message == "EmailAdmin")
                ? Conflict(_notificationContext.Notifications)
                : BadRequest(_notificationContext.Notifications);
        }

      var response = new
        {
            createdAdmin.Id,
            createdAdmin.NomeAdmin,
            createdAdmin.EmailAdmin,
            createdAdmin.Role
        };
        return CreatedAtAction(nameof(Create), new { id = createdAdmin.Id }, response);
    }

    [HttpGet("WhoAmI")]
    public async Task<IActionResult> GetCurrentAdminInfo()
    {
        var query = new GetCurrentAdminInfoQuery(HttpContext.User);
        var result = await _dispatcher.QueryAsync(query, CancellationToken.None);

        return result is null ? Unauthorized() : Ok(result);
    }
}
