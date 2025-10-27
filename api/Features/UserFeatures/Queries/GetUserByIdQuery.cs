using OperacaoCuriosidadeAPI.Common;
using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;

public record GetUserByIdQuery(int Id) : IQuery<UserModel>;

