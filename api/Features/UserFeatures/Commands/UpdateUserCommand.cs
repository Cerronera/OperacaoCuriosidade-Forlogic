using OperacaoCuriosidadeAPI.Common;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;

public record UpdateUserCommand(int Id, UserDTO dto): ICommand<UserModel>;

