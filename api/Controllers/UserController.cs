using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OperacaoCuriosidadeAPI.Identity;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Notifications;
using MediatR;

namespace OperacaoCuriosidadeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly NotificationContext _notificationContext;

    public UserController(IMediator mediator, NotificationContext notificationContext)
    {
        _mediator = mediator;
        _notificationContext = notificationContext;
    }

    [Authorize(Policy = IdentityData.AdminCollabRoleName)]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserDTO dto)
    {
        var command = new CreateUserCommand(dto);
        var createdUser = await _mediator.Send(command);

        if (_notificationContext.HasNotifications)
        {
            return _notificationContext.Notifications.Any(n => n.Message.Contains("E-mail"))
                ? Conflict(_notificationContext.Notifications)
                : BadRequest(_notificationContext.Notifications);
        }

        return CreatedAtAction(nameof(Get), new { id = createdUser.Id }, createdUser);
    }

    [Authorize(Policy = IdentityData.AdminCollabRoleName)]
    [HttpGet]
    public async Task<IActionResult> List(
        [FromQuery] int numeroPag = 1,
        [FromQuery] int registrosPag = 10,
        [FromQuery] string? filtro = null,
        [FromQuery] string? sortBy = null,
        [FromQuery] string? sortDirection = "asc",
        [FromQuery] string? busca = null
        )
    {
        var query = new GetAllUsersQuery(numeroPag, registrosPag, filtro, sortBy, sortDirection, busca);
        var user = await _mediator.Send(query);
        return Ok(user);
    }

    [Authorize(Policy = IdentityData.AdminCollabRoleName)]
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var query = new GetUserByIdQuery(id);
        var user = await _mediator.Send(query);

        return user is null ? NotFound() : Ok(user);
    }

    [Authorize(Policy = IdentityData.AdminCollabRoleName)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserDTO dto)
    {
        var command = new UpdateUserCommand(id, dto);
        var updatedUser = await _mediator.Send(command);

        if (_notificationContext.HasNotifications)
        {
            return NotFound(_notificationContext.Notifications);
        }

        return Ok(updatedUser);
    }

    [Authorize(Policy = IdentityData.AdministratorRoleName)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var command = new DeleteUserCommand(id);
        var success = await _mediator.Send(command);
        if (!success)
        {
            return NotFound(_notificationContext.Notifications);
        }

        return NoContent();
    }
}

