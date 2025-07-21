using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    private readonly IMediator _mediator;
    private readonly NotificationContext _notificationContext; 

    public AdminController(IMediator mediator, NotificationContext notificationContext)
    {
        _mediator = mediator;
        _notificationContext = notificationContext;
    }

    [HttpPost("create")]
    [Authorize(Policy = "Administrator")]
    public async Task<IActionResult> Create(AdminDTO dto)
    {
        var command = new CreateAdminCommand(dto);
        var createdAdmin = await _mediator.Send(command);

        if(_notificationContext.HasNotifications)
        {
            return _notificationContext.Notifications.Any(n => n.Message == "EmailAdmin")
                ? Conflict(_notificationContext.Notifications)
                : BadRequest(_notificationContext.Notifications);
        }

      var response = new
        {
            createdAdmin.Id,
            createdAdmin.AdminName,
            createdAdmin.AdminEmail,
            createdAdmin.Role
        };
        return CreatedAtAction(nameof(Create), new { id = createdAdmin.Id }, response);
    }

    [HttpGet("WhoAmI")]
    public async Task<IActionResult> GetCurrentAdminInfo()
    {
        var query = new GetCurrentAdminInfoQuery(HttpContext.User);
        var result = await _mediator.Send(query);

        return result is null ? Unauthorized() : Ok(result);
    }
}
