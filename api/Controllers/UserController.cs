using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OperacaoCuriosidadeAPI.Identity;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Notifications;

namespace OperacaoCuriosidadeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly ICreateUserHandler _createUserHandler;
    private readonly IUpdateUserHandler _updateUserHandler;
    private readonly IDeleteUserHandler _deleteUserHandler;
    private readonly IGetUserByIdHandler _getUserByIdHandler;
    private readonly IGetAllUsersHandler _getAllUsersHandler;
    private readonly NotificationContext _notificationContext;

    public UserController(
        ICreateUserHandler createUserHandler,
        IUpdateUserHandler updateUserHandler,
        IDeleteUserHandler deleteUserHandler,
        IGetUserByIdHandler getUserByIdHandler,
        IGetAllUsersHandler getAllUsersHandler,
        NotificationContext notificationContext)
    {
        _createUserHandler = createUserHandler;
        _updateUserHandler = updateUserHandler;
        _deleteUserHandler = deleteUserHandler;
        _getUserByIdHandler = getUserByIdHandler;
        _getAllUsersHandler = getAllUsersHandler;
        _notificationContext = notificationContext;
    }

    [Authorize(Policy = IdentityData.RoleAdminColab)]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UserDTO dto)
    {
        var command = new CreateUserCommand(dto);
        var createdUser = await _createUserHandler.Handle(command, CancellationToken.None);

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
        var users = await _getAllUsersHandler.Handle(query, CancellationToken.None);
        return Ok(users);
    }

    [Authorize(Policy = IdentityData.RoleAdminColab)]
    [HttpGet("{id}", Name = "GetUserById")]
    public async Task<IActionResult> GetById(int id)
    {
        var query = new GetUserByIdQuery(id);
        var user = await _getUserByIdHandler.Handle(query, CancellationToken.None);

        return user is null ? NotFound() : Ok(user);
    }

    [Authorize(Policy = IdentityData.RoleAdminColab)]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserDTO dto)
    {
        var command = new UpdateUserCommand(id, dto);
        var updatedUser = await _updateUserHandler.Handle(command, CancellationToken.None);

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
        var success = await _deleteUserHandler.Handle(command, CancellationToken.None);

        if (!success)
        {
            return NotFound(_notificationContext.Notifications);
        }

        return NoContent();
    }
}

