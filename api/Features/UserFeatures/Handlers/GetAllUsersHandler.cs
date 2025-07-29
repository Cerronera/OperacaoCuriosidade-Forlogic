using MediatR;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;
using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Repositories;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Handlers;

public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, PaginacaoDTO<UserModel>>
{
    private readonly IUserRepository _userRepository;
    public GetAllUsersHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public Task<PaginacaoDTO<UserModel>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var usersPaginados = _userRepository.GetPaginacaoUsers(
            request.NumeroPag,
            request.RegistrosPag,
            request.Filtro,
            request.SortBy,
            request.SortDirection,
            request.Busca
            );
        return Task.FromResult(usersPaginados);
    }
}
