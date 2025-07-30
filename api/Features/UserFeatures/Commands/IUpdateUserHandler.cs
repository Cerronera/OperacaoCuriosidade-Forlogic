using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;

public interface IUpdateUserHandler
{
    Task<UserModel> Handle (UpdateUserCommand command, CancellationToken cancellationToken);
}
