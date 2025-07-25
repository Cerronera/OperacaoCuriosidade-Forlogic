using MediatR;
using OperacaoCuriosidadeAPI.Features.DashboardFeatures.Queries;
using OperacaoCuriosidadeAPI.Repositories;
using System.Linq;

namespace OperacaoCuriosidadeAPI.Features.DashboardFeatures.Handlers;

public class GetPendenciaRevisadosHandler : IRequestHandler<GetPendenciaRevisadosQuery, int>
{
    private readonly IUserRepository _userRepository;

    public GetPendenciaRevisadosHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public Task<int> Handle(GetPendenciaRevisadosQuery request, CancellationToken cancellationToken)
    {
        var total = _userRepository.GetAll().Count(u => !u.RevisadoUsuario);
        return Task.FromResult(total);
    }
}
