using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.DTOs;

public class AdminDTO
{
    public string NomeAdmin { get; set; }
    public string EmailAdmin { get; set; }
    public string SenhaAdmin { get; set; }
    public RoleEnum Role { get; set; }
}
