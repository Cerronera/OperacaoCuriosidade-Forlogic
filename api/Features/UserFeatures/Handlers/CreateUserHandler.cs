using MediatR;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;
using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Notifications;
using OperacaoCuriosidadeAPI.Repositories;
using OperacaoCuriosidadeAPI.Validators;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Handlers;

public class CreateUserHandler : IRequestHandler<CreateUserCommand, UserModel>
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

    public Task<UserModel> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        _validator.Validate(request.dto);
        if (_notificationContext.HasNotifications)
        {
            return Task.FromResult<UserModel>(null);
        }

        if (_userRepository.EmailExists(request.dto.EmailUsuario))
        {
            _notificationContext.AddNotification("Email", "O e-mail fornecido já está em uso.");
            return Task.FromResult<UserModel>(null);
        }

        var user = new UserModel
        {
            NomeUsuario = request.dto.NomeUsuario,
            EmailUsuario = request.dto.EmailUsuario,
            IdadeUsuario = request.dto.IdadeUsuario,
            TelefoneUsuario = request.dto.TelefoneUsuario,
            EnderecoUsuario = request.dto.EnderecoUsuario,
            OutrasInformacoesUsuario = request.dto.OutrasInformacoesUsuario,
            InteressesUsuario = request.dto.InteressesUsuario,
            ValoresUsuario = request.dto.ValoresUsuario,
            SentimentosUsuario = request.dto.SentimentosUsuario,
            DataCadastro = DateTime.UtcNow,
            StatusUsuario = request.dto.StatusUsuario,
            RevisadoUsuario = false
        };

        var createdUser = _userRepository.Create(user);
        return Task.FromResult(createdUser);
    }
}
