using MediatR;
using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;

public record GetUserByIdQuery(int Id) : IRequest<UserModel?>;

