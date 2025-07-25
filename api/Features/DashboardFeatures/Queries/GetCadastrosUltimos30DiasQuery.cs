using MediatR;

namespace OperacaoCuriosidadeAPI.Features.DashboardFeatures.Queries;

public record GetCadastrosUltimos30DiasQuery() : IRequest<int>;

