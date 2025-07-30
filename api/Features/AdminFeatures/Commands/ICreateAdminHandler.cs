using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Features.AdminFeatures.Commands;

public interface ICreateAdminHandler
{
    Task<AdminModel> Handle(CreateAdminCommand command, CancellationToken cancellationToken);
}
