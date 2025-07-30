using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;
using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Repositories;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Handlers;

public class GetAllUsersHandler : IGetAllUsersHandler
{
    private readonly IUserRepository _userRepository;
    public GetAllUsersHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<PaginacaoDTO<UserModel>> Handle(GetAllUsersQuery query, CancellationToken cancellationToken)
    {
        var usersPaginados = _userRepository.GetPaginacaoUsers(
            query.NumeroPag,
            query.RegistrosPag,
            query.Filtro,
            query.SortBy,
            query.SortDirection,
            query.Busca
            );
        return await Task.FromResult(usersPaginados);
    }
}
