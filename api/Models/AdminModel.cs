namespace OperacaoCuriosidadeAPI.Models;

public class AdminModel
{
    public int Id { get; set; }
    public string NomeAdmin { get; set; }
    public string EmailAdmin { get; set; }
    public string SenhaAdmin { get; set; }
    public RoleEnum Role { get; set; }

}
