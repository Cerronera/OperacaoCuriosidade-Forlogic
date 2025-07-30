using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;

public interface IGetAllUsersHandler
{
    Task<PaginacaoDTO<UserModel>> Handle (GetAllUsersQuery query, CancellationToken cancellationToken);
}
