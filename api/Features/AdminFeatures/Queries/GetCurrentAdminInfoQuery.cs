using System.Security.Claims;
using OperacaoCuriosidadeAPI.Common;

namespace OperacaoCuriosidadeAPI.Features.AdminFeatures.Queries;

public record GetCurrentAdminInfoQuery(ClaimsPrincipal User) : IQuery<object?>;
