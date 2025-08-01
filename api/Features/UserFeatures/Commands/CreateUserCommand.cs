using OperacaoCuriosidadeAPI.Common;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;

public record CreateUserCommand(UserDTO dto) : ICommand<UserModel>;

