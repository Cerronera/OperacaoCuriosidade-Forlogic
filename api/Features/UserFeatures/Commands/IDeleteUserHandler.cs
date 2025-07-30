namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;

public interface IDeleteUserHandler
{
    Task<bool> Handle(DeleteUserCommand command, CancellationToken cancellationToken);
}
