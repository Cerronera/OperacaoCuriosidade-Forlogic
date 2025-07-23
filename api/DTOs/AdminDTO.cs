using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.DTOs;

public class AdminDTO
{
    public required string NomeAdmin { get; set; }
    public required string EmailAdmin { get; set; }
    public required string SenhaAdmin { get; set; }
    public RoleEnum Role { get; set; }
}
