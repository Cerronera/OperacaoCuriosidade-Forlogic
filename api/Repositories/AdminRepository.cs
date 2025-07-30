using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Repositories;

public class AdminRepository : IAdminRepository
{
    private static List<AdminModel> _admins = new();
    private static int _nextId = 1;

    public AdminRepository()
    {
        if(!_admins.Any())
        {
            _admins.Add(new AdminModel
            {
                Id = _nextId++,
                NomeAdmin = "Administrador",
                EmailAdmin = "admin@email.com",
                SenhaAdmin = "admin123",
                Role = RoleEnum.Administrador
            });
        }
    }
    public AdminModel Create(AdminModel admin)
    {
        admin.Id = _nextId++;
        _admins.Add(admin);
        return admin;
    }

    public bool EmailExists(string email)
    {
        return _admins.Any(a => a.EmailAdmin.ToLower() == email.ToLower());
    }

    public List<AdminModel> GetAll()
    {
        return _admins;
    }

    public AdminModel? GetByEmail(string email)
    {
        return _admins.FirstOrDefault(a => a.EmailAdmin.ToLower() == email.ToLower());
    }
}
