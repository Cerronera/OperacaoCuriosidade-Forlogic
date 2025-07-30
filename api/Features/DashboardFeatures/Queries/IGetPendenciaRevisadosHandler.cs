namespace OperacaoCuriosidadeAPI.Features.DashboardFeatures.Queries;

public interface IGetPendenciaRevisadosHandler
{
    Task<int> Handle(GetPendenciaRevisadosQuery query, CancellationToken cancellationToken);
}
