using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OperacaoCuriosidadeAPI.Identity;
using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Services;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Validators;
using OperacaoCuriosidadeAPI.Notifications;

namespace OperacaoCuriosidadeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly NotificationContext _notificationContext;
    private readonly UserValidator _userValidator;
    
    public UserController(IUserService userService, NotificationContext notificationContext, UserValidator userValidator)
    {
        _userService = userService;
        _notificationContext = notificationContext;
        _userValidator = userValidator; 
    }

    [Authorize(Policy = IdentityData.AdminCollabRoleName)]
    [HttpPost]
    public IActionResult Create([FromBody]UserDTO dto)
    {
        _userValidator.Validate(dto);

        var user = new UserModel
        {
            NomeUsuario = dto.NomeUsuario,
            EmailUsuario = dto.EmailUsuario,
            IdadeUsuario = dto.IdadeUsuario,
            TelefoneUsuario = dto.TelefoneUsuario,
            EnderecoUsuario = dto.EnderecoUsuario,
            OutrasInformacoesUsuario = dto.OutrasInformacoesUsuario,
            InteressesUsuario = dto.InteressesUsuario,
            ValoresUsuario = dto.ValoresUsuario,
            SentimentosUsuario = dto.SentimentosUsuario,
            DataCadastro = DateTime.UtcNow,
            StatusUsuario = dto.StatusUsuario,
            RevisadoUsuario = false
        };
        var createdUser = _userService.Create(user);

        if (_notificationContext.HasNotifications)
        {
            return Conflict(_notificationContext.Notifications);
        }

        return CreatedAtAction(nameof(Get), new { id = createdUser.Id }, createdUser);
    }

    [Authorize(Policy = IdentityData.AdminCollabRoleName)]
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var user = _userService.Get(id);

        if (user is null) return NotFound("User not found");
        return Ok(user);
    }

    [Authorize(Policy = IdentityData.AdminCollabRoleName)]
    [HttpGet]
    public IActionResult List()
    {
        var users = _userService.List();

        return Ok(users);
    }
    
    [Authorize(Policy = IdentityData.AdminCollabRoleName)]
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody]UserDTO dto)
    {
        _userValidator.Validate(dto);
        if (_notificationContext.HasNotifications)
        {
            return BadRequest(_notificationContext.Notifications);
        }

        var existingUser = _userService.Get(id);

        if(existingUser is null)
        {
            return NotFound("User not found");
        }
        existingUser.NomeUsuario = dto.NomeUsuario;
        existingUser.EmailUsuario = dto.EmailUsuario;
        existingUser.IdadeUsuario = dto.IdadeUsuario;
        existingUser.TelefoneUsuario = dto.TelefoneUsuario;
        existingUser.EnderecoUsuario = dto.EnderecoUsuario;
        existingUser.OutrasInformacoesUsuario = dto.OutrasInformacoesUsuario;
        existingUser.InteressesUsuario = dto.InteressesUsuario;
        existingUser.ValoresUsuario = dto.ValoresUsuario;
        existingUser.SentimentosUsuario = dto.SentimentosUsuario;
        existingUser.StatusUsuario = dto.StatusUsuario;
        existingUser.RevisadoUsuario = true;
    

        var updatedUser = _userService.Update(id, existingUser);
        return Ok(updatedUser);
    }

    [Authorize(Policy = IdentityData.AdministratorRoleName)]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var success = _userService.Delete(id);

        if (!success)
        {
            return NotFound("User not found");
        }
        return NoContent();
     }


    [HttpGet("WhoAmI")]
    public IActionResult GetCurrentAdminInfo()
    {
        var identity = HttpContext.User.Identity as ClaimsIdentity;

        if(identity != null)
        {
            var adminClaims = identity.Claims;

            var adminInfo = new
            {
                Nome = adminClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value,
                Email = adminClaims.FirstOrDefault(o => o.Type == ClaimTypes.Email)?.Value,
                Role = adminClaims.FirstOrDefault(o => o.Type == ClaimTypes.Role)?.Value
            };

            return Ok(adminInfo);
        }
        return Unauthorized();
    }
}
