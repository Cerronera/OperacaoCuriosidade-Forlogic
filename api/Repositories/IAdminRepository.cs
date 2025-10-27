using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Repositories;

public interface IAdminRepository
{
    AdminModel Create(AdminModel admin);
    AdminModel? GetByEmail(string email);
    bool EmailExists(string email);
    List<AdminModel> GetAll();

}
