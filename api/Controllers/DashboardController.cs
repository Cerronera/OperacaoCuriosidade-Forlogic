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
    private readonly IGetTotalCadastrosHandler _getTotalCadastrosHandler;
    private readonly IGetPendenciaRevisadosHandler _getPendenciaRevisadosHandler;
    private readonly IGetCadastrosUltimos30DiasHandler _getCadastrosUltimos30DiasHandler;

    public DashboardController(
        IGetTotalCadastrosHandler getTotalCadastrosHandler,
        IGetPendenciaRevisadosHandler getPendenciaRevisadosHandler,
        IGetCadastrosUltimos30DiasHandler getCadastrosUltimos30DiasHandler)
    {
        _getTotalCadastrosHandler = getTotalCadastrosHandler;
        _getPendenciaRevisadosHandler = getPendenciaRevisadosHandler;
        _getCadastrosUltimos30DiasHandler = getCadastrosUltimos30DiasHandler;
    }

    [HttpGet("totalCadastros")]
    public async Task<IActionResult> GetTotalCadastros()
    {
        var result = await _getTotalCadastrosHandler.Handle(new GetTotalCadastrosQuery(), CancellationToken.None);
        return Ok(result);
    }

    [HttpGet("cadastrosUltimos30Dias")]
    public async Task<IActionResult> GetCadastrosUltimos30Dias()
    {
        var result = await _getCadastrosUltimos30DiasHandler.Handle(new GetCadastrosUltimos30DiasQuery(), CancellationToken.None);
        return Ok(result);
    }

    [HttpGet("pendenciaRevisados")]
    public async Task<IActionResult> GetPendenciaRevisados()
    {
        var result = await _getPendenciaRevisadosHandler.Handle(new GetPendenciaRevisadosQuery(), CancellationToken.None);
        return Ok(result);
    }
}
