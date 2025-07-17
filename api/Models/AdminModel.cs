namespace OperacaoCuriosidadeAPI.Models;

public class AdminModel
{
    public int Id { get; set; }
    public string AdminName { get; set; }
    public string AdminEmail { get; set; }
    public string AdminPassword { get; set; }
    public RoleEnum Role { get; set; }

}
