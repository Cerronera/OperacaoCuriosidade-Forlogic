using MediatR;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;

public record DeleteUserCommand(int Id) : IRequest<bool>;

