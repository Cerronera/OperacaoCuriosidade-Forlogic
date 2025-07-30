namespace OperacaoCuriosidadeAPI.Features.LoginFeatures.Commands;

public interface ILoginHandler
{
    Task<string?> Handle(LoginCommand command, CancellationToken cancellationToken);
}
