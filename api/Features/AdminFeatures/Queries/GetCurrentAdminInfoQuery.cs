using System.Security.Claims;

namespace OperacaoCuriosidadeAPI.Features.AdminFeatures.Queries;

public record GetCurrentAdminInfoQuery(ClaimsPrincipal User);
