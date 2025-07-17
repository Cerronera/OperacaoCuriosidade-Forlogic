using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Services;

public interface IUserService
{
    IEnumerable<UserModel> List();
    UserModel Create(UserModel user);
    UserModel? Get(int id);
    UserModel? Update(int id, UserModel user);
    bool Delete(int id);
}
