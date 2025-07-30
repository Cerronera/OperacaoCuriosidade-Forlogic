using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.DTOs;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Queries;

public record GetAllUsersQuery(
    int NumeroPag = 1,
    int RegistrosPag = 10,
    string? Filtro = null,
    string? SortBy = null,
    string? SortDirection = "asc",
    string? Busca = null
    );

