using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Repositories;

public interface IUserRepository
{
    IEnumerable<UserModel> GetAll();
    UserModel? GetById(int id);
    UserModel Create(UserModel user);
    UserModel? Update(UserModel user);
    void Delete(int id);
    bool EmailExists(string email);
}
