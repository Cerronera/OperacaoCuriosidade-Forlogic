using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Services;

public interface IAdminService
{
    AdminModel Create(AdminModel admin);
    AdminModel? GetByEmail(string email);
    List<AdminModel> ListAdmins();
    bool EmailExists(string email);
}
