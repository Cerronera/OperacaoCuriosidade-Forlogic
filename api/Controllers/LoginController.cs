using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Features.LoginFeatures.Commands;


namespace OperacaoCuriosidadeAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly IMediator _mediator;
    public LoginController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        var command = new LoginCommand(dto);
        var token = await _mediator.Send(command);
        if(token is null)
        {
            return Unauthorized("E-mail ou Senha incorretos");
        } else
        {
            return Ok(token);
        }
    }
}
