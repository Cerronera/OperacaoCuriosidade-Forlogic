namespace OperacaoCuriosidadeAPI.Features.DashboardFeatures.Queries;

public interface IGetCadastrosUltimos30DiasHandler
{
    Task<int> Handle(GetCadastrosUltimos30DiasQuery query, CancellationToken cancellationToken);
}
