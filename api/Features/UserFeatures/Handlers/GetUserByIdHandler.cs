using MediatR;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;
using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Repositories;
using System.Threading;
using System.Threading.Tasks;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Handlers;

public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, UserModel?>
{
    private readonly IUserRepository _userRepository;

    public GetUserByIdHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public Task<UserModel?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = _userRepository.GetById(request.Id);
        return Task.FromResult(user);
    }
}
