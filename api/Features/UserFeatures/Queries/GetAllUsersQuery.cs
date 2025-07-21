using MediatR;
using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;

public record GetAllUsersQuery() : IRequest<IEnumerable<UserModel>>;

