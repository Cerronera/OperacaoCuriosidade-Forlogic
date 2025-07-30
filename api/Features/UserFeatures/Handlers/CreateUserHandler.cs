using OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;
using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Notifications;
using OperacaoCuriosidadeAPI.Repositories;
using OperacaoCuriosidadeAPI.Validators;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Handlers;

public class CreateUserHandler : ICreateUserHandler
{
    private readonly IUserRepository _userRepository;
    private readonly UserValidator _validator;
    private readonly NotificationContext _notificationContext;
    public CreateUserHandler(IUserRepository userRepository, NotificationContext notificationContext, UserValidator validator)
    {
        _userRepository = userRepository;
        _notificationContext = notificationContext;
        _validator = validator;
    }

    public async Task<UserModel> Handle(CreateUserCommand command, CancellationToken cancellationToken)
    {
        _validator.Validate(command.dto);
        if (_notificationContext.HasNotifications)
        {
            return null;
        }

        if (_userRepository.EmailExists(command.dto.EmailUsuario))
        {
            _notificationContext.AddNotification("Email", "O e-mail fornecido já está em uso.");
            return null;
        }

        var user = new UserModel
        {
            NomeUsuario = command.dto.NomeUsuario,
            EmailUsuario = command.dto.EmailUsuario,
            IdadeUsuario = command.dto.IdadeUsuario,
            TelefoneUsuario = command.dto.TelefoneUsuario,
            EnderecoUsuario = command.dto.EnderecoUsuario,
            OutrasInformacoesUsuario = command.dto.OutrasInformacoesUsuario,
            InteressesUsuario = command.dto.InteressesUsuario,
            ValoresUsuario = command.dto.ValoresUsuario,
            SentimentosUsuario = command.dto.SentimentosUsuario,
            DataCadastro = DateTime.UtcNow,
            StatusUsuario = command.dto.StatusUsuario,
            RevisadoUsuario = false
        };

        var createdUser = _userRepository.Create(user);
        return createdUser;
    }
}
