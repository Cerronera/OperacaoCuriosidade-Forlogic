using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OperacaoCuriosidadeAPI.Common;
using OperacaoCuriosidadeAPI.Features.DashboardFeatures.Queries;

namespace OperacaoCuriosidadeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDispatcher _dispatcher;

    public DashboardController(IDispatcher dispatcher)
    {
       _dispatcher = dispatcher;
    }

    [HttpGet("totalCadastros")]
    public async Task<IActionResult> GetTotalCadastros()
    {
        var result = await _dispatcher.QueryAsync(new GetTotalCadastrosQuery());
        return Ok(result);
    }

    [HttpGet("cadastrosUltimos30Dias")]
    public async Task<IActionResult> GetCadastrosUltimos30Dias()
    {
        var result = await _dispatcher.QueryAsync(new GetCadastrosUltimos30DiasQuery());
        return Ok(result);
    }

    [HttpGet("pendenciaRevisados")]
    public async Task<IActionResult> GetPendenciaRevisados()
    {
        var result = await _dispatcher.QueryAsync(new GetPendenciaRevisadosQuery());
        return Ok(result);
    }
}
