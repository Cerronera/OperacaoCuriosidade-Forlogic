namespace OperacaoCuriosidadeAPI.Features.DashboardFeatures.Queries;

public interface IGetTotalCadastrosHandler
{
    Task<int> Handle (GetTotalCadastrosQuery query, CancellationToken cancellationToken);
}
