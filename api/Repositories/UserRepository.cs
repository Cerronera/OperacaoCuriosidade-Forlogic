using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Repositories;

public class UserRepository : IUserRepository
{
    private static readonly List<UserModel> _users = new();
    private static int _nextId = 1;

    public UserModel Create (UserModel user)
    {
        user.Id = _nextId++;
        _users.Add(user);
        return user;
    }
    public void Delete(int id)
    {
        var user = GetById(id);
        if (user != null)
        {
            _users.Remove(user);
        }
    }

    public bool EmailExists(string email)
    {
        return _users.Any(u => u.EmailUsuario.ToLower() == email.ToLower());
    }

    public IEnumerable<UserModel> GetAll()
    {
        return _users;
    }

    public UserModel? GetById(int id)
    {
        return _users.FirstOrDefault(u => u.Id == id);
    }

    public UserModel? Update(UserModel user)
    {
        var index = _users.FindIndex(u => u.Id == user.Id);
            if(index != -1)
        {
            _users[index] = user;
            return user;
        }
        return null;
    }

}
