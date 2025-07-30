using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;

public interface ICreateUserHandler
{
    Task<UserModel> Handle (CreateUserCommand command, CancellationToken cancellationToken);
}
