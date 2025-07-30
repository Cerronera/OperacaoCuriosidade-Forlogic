using OperacaoCuriosidadeAPI.Features.DashboardFeatures.Queries;
using OperacaoCuriosidadeAPI.Repositories;
using System;
using System.Linq;


namespace OperacaoCuriosidadeAPI.Features.DashboardFeatures.Handlers;

public class GetCadastrosUltimos30DiasHandler : IGetCadastrosUltimos30DiasHandler
{
    private readonly IUserRepository _userRepository;

    public GetCadastrosUltimos30DiasHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public Task<int> Handle(GetCadastrosUltimos30DiasQuery query, CancellationToken cancellationToken)
    {
        var trintaDiasAtras = DateTime.UtcNow.AddDays(-30);
        var total = _userRepository.GetAll().Count(u => u.DataCadastro >= trintaDiasAtras);
        return Task.FromResult(total);
    }
}
