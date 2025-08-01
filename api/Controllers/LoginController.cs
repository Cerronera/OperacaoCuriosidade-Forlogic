using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OperacaoCuriosidadeAPI.Common;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Features.LoginFeatures.Commands;


namespace OperacaoCuriosidadeAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly IDispatcher _dispatcher;
    public LoginController(IDispatcher dispatcher)
    {
        _dispatcher = dispatcher;
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        var command = new LoginCommand(dto);
        var token = await _dispatcher.SendAsync(command);
        if(token is null)
        {
            return Unauthorized("E-mail ou Senha incorretos");
        } else
        {
            return Ok(token);
        }
    }
}
