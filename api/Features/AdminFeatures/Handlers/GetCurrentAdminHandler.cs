using OperacaoCuriosidadeAPI.Common;
using OperacaoCuriosidadeAPI.Features.AdminFeatures.Queries;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace OperacaoCuriosidadeAPI.Features.AdminFeatures.Handlers;

public class GetCurrentAdminHandler : IQueryHandler<GetCurrentAdminInfoQuery, object?>
{
    public async Task<object?> Handle(GetCurrentAdminInfoQuery command, CancellationToken cancellationToken)
    {
        var identity = command.User.Identity as ClaimsIdentity;
        if(identity is null || !identity.IsAuthenticated)
        {
            return null;
        }

        var adminClaims = identity.Claims;

        var adminInfo = new
        {
            Nome = adminClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value,
            Email = adminClaims.FirstOrDefault(o => o.Type == ClaimTypes.Email)?.Value,
            Role = adminClaims.FirstOrDefault(o => o.Type == ClaimTypes.Role)?.Value
        };

        return adminInfo;
    }
}
