using MediatR;

namespace OperacaoCuriosidadeAPI.Features.DashboardFeatures.Queries;

public record GetPendenciaRevisadosQuery() : IRequest<int>;

