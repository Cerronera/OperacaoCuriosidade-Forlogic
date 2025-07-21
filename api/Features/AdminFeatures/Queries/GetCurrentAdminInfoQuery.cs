using System.Security.Claims;
using MediatR;

namespace OperacaoCuriosidadeAPI.Features.AdminFeatures.Queries;

public record GetCurrentAdminInfoQuery(ClaimsPrincipal User) : IRequest<object?>;
