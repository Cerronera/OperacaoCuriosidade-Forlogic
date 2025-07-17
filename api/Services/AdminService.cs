using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Services;

public class AdminService : IAdminService
{
    private static List<AdminModel> _admins = new List<AdminModel>();
    private static int _proximoId = 1;

    public AdminService()
    {
        if (!_admins.Any())
        {
            _admins.Add(new AdminModel
            {
                Id = _proximoId++,
                AdminName = "Administrador",
                AdminEmail = "admin@email.com",
                AdminPassword = "admin123"
            });
        }
    }

    public AdminModel Create(AdminModel admin)
    {
        admin.Id = _proximoId++;
        //fazer hash da senha antes de salvar
        _admins.Add(admin);
        return admin;
    }

    public bool EmailExists(string email)
    {
        return _admins.Any(a => a.AdminEmail.ToLower() == email.ToLower());
    }

    public AdminModel? GetByEmail(string email)
    {
        return _admins.FirstOrDefault(a => a.AdminEmail.ToLower() == email.ToLower());
    }

    public List<AdminModel> ListAdmins()
    {
        return _admins;
    }
}
