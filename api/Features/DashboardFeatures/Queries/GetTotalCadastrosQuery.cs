using MediatR;

namespace OperacaoCuriosidadeAPI.Features.DashboardFeatures.Queries;

public record GetTotalCadastrosQuery() : IRequest<int>;
