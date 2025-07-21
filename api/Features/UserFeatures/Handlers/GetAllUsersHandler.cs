using MediatR;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;
using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Repositories;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Handlers;

public class GetAllUsersHandler : IRequestHandler<GetAllUsersQuery, IEnumerable<UserModel>>
{
    private readonly IUserRepository _userRepository;
    public GetAllUsersHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public Task<IEnumerable<UserModel>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = _userRepository.GetAll();
        return Task.FromResult(users);
    }
}
