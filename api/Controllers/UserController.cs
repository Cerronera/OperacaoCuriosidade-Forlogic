using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OperacaoCuriosidadeAPI.Identity;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Notifications;
using OperacaoCuriosidadeAPI.Common;

namespace OperacaoCuriosidadeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{

    private readonly IDispatcher _dispatcher;
    private readonly NotificationContext _notificationContext;

    public UserController(
       
        IDispatcher dispatcher,
        NotificationContext notificationContext)
    {
        _dispatcher = dispatcher;
        _notificationContext = notificationContext;
    }

    [Authorize(Policy = IdentityData.RoleAdminColab)]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserDTO dto)
    {
        var command = new CreateUserCommand(dto);
        var createdUser = await _dispatcher.SendAsync(command);

        if (_notificationContext.HasNotifications)
        {
            return _notificationContext.Notifications.Any(n => n.Message.Contains("E-mail"))
                ? Conflict(_notificationContext.Notifications)
                : BadRequest(_notificationContext.Notifications);
        }

        return CreatedAtAction(nameof(GetById), new { id = createdUser.Id }, createdUser);
    }

    [Authorize(Policy = IdentityData.RoleAdminColab)]
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
        var users = await _dispatcher.QueryAsync(query);
        return Ok(users);
    }

    [Authorize(Policy = IdentityData.RoleAdminColab)]
    [HttpGet("{id}", Name = "GetUserById")]
    public async Task<IActionResult> GetById(int id)
    {
        var query = new GetUserByIdQuery(id);
        var user = await _dispatcher.QueryAsync(query);

        return user is null ? NotFound() : Ok(user);
    }

    [Authorize(Policy = IdentityData.RoleAdminColab)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserDTO dto)
    {
        var command = new UpdateUserCommand(id, dto);
        var updatedUser = await _dispatcher.SendAsync(command);

        if (_notificationContext.HasNotifications)
        {
            return BadRequest(_notificationContext.Notifications);
        }

        return Ok(updatedUser);
    }   

    [Authorize(Policy = IdentityData.RoleAdministrador)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var command = new DeleteUserCommand(id);
        var success = await _dispatcher.SendAsync(command);

        if (!success)
        {
            return NotFound(_notificationContext.Notifications);
        }

        return NoContent();
    }
}

