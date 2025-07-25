using MediatR;
using OperacaoCuriosidadeAPI.Features.DashboardFeatures.Queries;
using OperacaoCuriosidadeAPI.Repositories;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OperacaoCuriosidadeAPI.Features.DashboardFeatures.Handlers;

public class GetTotalCadastrosHandler : IRequestHandler<GetTotalCadastrosQuery, int>
{
    private readonly IUserRepository _userRepository;

    public GetTotalCadastrosHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public Task<int> Handle(GetTotalCadastrosQuery request, CancellationToken cancellationToken)
    {
        var total = _userRepository.GetAll().Count();
        return Task.FromResult(total);
    }
}
