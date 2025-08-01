using OperacaoCuriosidadeAPI.Common;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Features.AdminFeatures.Commands;

public record CreateAdminCommand(AdminDTO dto) : ICommand<AdminModel>;

