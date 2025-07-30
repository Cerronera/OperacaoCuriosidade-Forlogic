using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;

public interface IGetUserByIdHandler
{
    Task<UserModel> Handle(GetUserByIdQuery query, CancellationToken cancellationToken);
}
