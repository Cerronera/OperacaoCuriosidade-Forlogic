using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Features.LoginFeatures.Commands;


namespace OperacaoCuriosidadeAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly ILoginHandler _loginHandler;
    public LoginController(ILoginHandler loginHandler)
    {
        _loginHandler = loginHandler;
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        var command = new LoginCommand(dto);
        var token = await _loginHandler.Handle(command, CancellationToken.None);
        if(token is null)
        {
            return Unauthorized("E-mail ou Senha incorretos");
        } else
        {
            return Ok(token);
        }
    }
}
