using MediatR;
using OperacaoCuriosidadeAPI.Features.AdminFeatures.Queries;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace OperacaoCuriosidadeAPI.Features.AdminFeatures.Handlers;

public class GetCurrentAdminHandler : IRequestHandler<GetCurrentAdminInfoQuery, object?>
{
    public Task<object?> Handle(GetCurrentAdminInfoQuery request, CancellationToken cancellationToken)
    {
        var identity = request.User.Identity as ClaimsIdentity;
        if(identity is null || !identity.IsAuthenticated)
        {
            return Task.FromResult<object?>(null);
        }

        var adminClaims = identity.Claims;

        var adminInfo = new
        {
            Nome = adminClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value,
            Email = adminClaims.FirstOrDefault(o => o.Type == ClaimTypes.Email)?.Value,
            Role = adminClaims.FirstOrDefault(o => o.Type == ClaimTypes.Role)?.Value
        };

        return Task.FromResult<object?>(adminInfo);
    }
}
