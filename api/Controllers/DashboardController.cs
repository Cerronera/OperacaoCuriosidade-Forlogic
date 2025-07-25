using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OperacaoCuriosidadeAPI.Features.DashboardFeatures.Handlers;
using OperacaoCuriosidadeAPI.Features.DashboardFeatures.Queries;

namespace OperacaoCuriosidadeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("totalCadastros")]
    public async Task<IActionResult> GetTotalCadastros()
    {
        var result = await _mediator.Send(new GetTotalCadastrosQuery());
        return Ok(result);
    }

    [HttpGet("cadastrosUltimos30Dias")]
    public async Task<IActionResult> GetCadastrosUltimos30Dias()
    {
        var result = await _mediator.Send(new GetCadastrosUltimos30DiasQuery());
        return Ok(result);
    }

    [HttpGet("pendenciaRevisados")]
    public async Task<IActionResult> GetPendenciaRevisados()
    {
        var result = await _mediator.Send(new GetPendenciaRevisadosQuery());
        return Ok(result);
    }
}
