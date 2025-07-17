using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Notifications;
using OperacaoCuriosidadeAPI.Repositories;

namespace OperacaoCuriosidadeAPI.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly NotificationContext _notificationContext;
    public UserService(IUserRepository userRepository, NotificationContext notificationContext)
    {
        _userRepository = userRepository;
        _notificationContext = notificationContext;
    }

    public UserModel Create(UserModel user)
    {
        if (_userRepository.EmailExists(user.EmailUsuario))
        {
            _notificationContext.AddNotification("Email","O e-mail fornecido já está em uso.");
            return null;
        }

        return _userRepository.Create(user);
    }
    public UserModel? Get(int id)
    {
        return _userRepository.GetById(id);
    }
    public IEnumerable<UserModel> List()
    {
        return _userRepository.GetAll();
    }
    public UserModel? Update(int id, UserModel user)
    {
        var existingUser = _userRepository.GetById(id);

        if (existingUser is null)
        {
            return null;
        }
        user.Id = id;
        return _userRepository.Update(user);
    }

    public bool Delete(int id)
    {
        var existingUser = _userRepository.GetById(id);
        if (existingUser is null)
        {
            return false;
        }
        _userRepository.Delete(id);
        return true;
    }

}