
using OperacaoCuriosidadeAPI.Common;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;

public record DeleteUserCommand(int Id) : ICommand<bool>;

