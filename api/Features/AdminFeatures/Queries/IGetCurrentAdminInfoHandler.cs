using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Features.AdminFeatures.Queries;

public interface IGetCurrentAdminInfoHandler
{
    Task<object?> Handle(GetCurrentAdminInfoQuery query, CancellationToken cancellationToken);
}
