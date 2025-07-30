using OperacaoCuriosidadeAPI.Features.UserFeatures.Commands; 
using OperacaoCuriosidadeAPI.Notifications;
using OperacaoCuriosidadeAPI.Repositories;
using System.Threading;
using System.Threading.Tasks;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Handlers;

public class DeleteUserHandler : IDeleteUserHandler
{
    private readonly IUserRepository _userRepository;
    private readonly NotificationContext _notificationContext;
    public DeleteUserHandler(IUserRepository userRepository, NotificationContext notificationContext)
    {
        _userRepository = userRepository;
        _notificationContext = notificationContext;
    }

    public async Task<bool> Handle(DeleteUserCommand command, CancellationToken cancellationToken)
    {
        var existingUser = _userRepository.GetById(command.Id);
        if (existingUser == null)
        {
            _notificationContext.AddNotification("User", "Usuário não encontrado");
            return false;
        }

        _userRepository.Delete(command.Id);

        return true;
    }
}
