using MediatR;
using OperacaoCuriosidadeAPI.DTOs;

namespace OperacaoCuriosidadeAPI.Features.LoginFeatures.Commands;

public record LoginCommand(LoginDTO dto) : IRequest<string?>;
