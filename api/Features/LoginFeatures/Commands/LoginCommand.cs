using OperacaoCuriosidadeAPI.Common;
using OperacaoCuriosidadeAPI.DTOs;

namespace OperacaoCuriosidadeAPI.Features.LoginFeatures.Commands;

public record LoginCommand(LoginDTO dto) : ICommand<string?>;
