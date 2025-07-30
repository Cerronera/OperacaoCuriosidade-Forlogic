using OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;
using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Notifications;
using OperacaoCuriosidadeAPI.Repositories;
using OperacaoCuriosidadeAPI.Validators;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Handlers;

public class UpdateUserHandler : IUpdateUserHandler
{
    private readonly IUserRepository _userRepository;
    private readonly UserValidator _validator;
    private readonly NotificationContext _notificationContext;
    public UpdateUserHandler(IUserRepository userRepository, NotificationContext notificationContext, UserValidator validator)
    {
        _userRepository = userRepository;
        _notificationContext = notificationContext;
        _validator = validator;
    }

    public async Task<UserModel> Handle(UpdateUserCommand command, CancellationToken cancellationToken)
    {
        _validator.Validate(command.dto);
        if (_notificationContext.HasNotifications)
        {
            return null;
        }

        var existingUser = _userRepository.GetById(command.Id);
        if (existingUser == null)
        {
            _notificationContext.AddNotification("User", "Usuário não encontrado");
            return null;
        }

        existingUser.NomeUsuario = command.dto.NomeUsuario;
        existingUser.EmailUsuario = command.dto.EmailUsuario;
        existingUser.IdadeUsuario = command.dto.IdadeUsuario;
        existingUser.TelefoneUsuario = command.dto.TelefoneUsuario;
        existingUser.EnderecoUsuario = command.dto.EnderecoUsuario;
        existingUser.OutrasInformacoesUsuario = command.dto.OutrasInformacoesUsuario;
        existingUser.InteressesUsuario = command.dto.InteressesUsuario;
        existingUser.ValoresUsuario = command.dto.ValoresUsuario;
        existingUser.SentimentosUsuario = command.dto.SentimentosUsuario;
        existingUser.StatusUsuario = command.dto.StatusUsuario;
        existingUser.RevisadoUsuario = true;

        var updatedUser = _userRepository.Update(existingUser);
        return updatedUser;
    }
}
