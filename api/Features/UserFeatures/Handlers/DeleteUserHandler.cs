using MediatR;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Commands; 
using OperacaoCuriosidadeAPI.Notifications;
using OperacaoCuriosidadeAPI.Repositories;
using System.Threading;
using System.Threading.Tasks;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Handlers;

public class DeleteUserHandler : IRequestHandler<DeleteUserCommand, bool>
{
    private readonly IUserRepository _userRepository;
    private readonly NotificationContext _notificationContext;
    public DeleteUserHandler(IUserRepository userRepository, NotificationContext notificationContext)
    {
        _userRepository = userRepository;
        _notificationContext = notificationContext;
    }

    public Task<bool> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var existingUser = _userRepository.GetById(request.Id);
        if (existingUser == null)
        {
            _notificationContext.AddNotification("User", "Usuário não encontrado");
            return Task.FromResult(false);
        }

        _userRepository.Delete(request.Id);

        return Task.FromResult(true);
    }
}
