using MediatR;
using OperacaoCuriosidadeAPI.Features.UserFeatures.Commands;
using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Notifications;
using OperacaoCuriosidadeAPI.Repositories;
using OperacaoCuriosidadeAPI.Validators;

namespace OperacaoCuriosidadeAPI.Features.UserFeatures.Handlers;

public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, UserModel>
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

    public Task<UserModel> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        _validator.Validate(request.dto);
        if (_notificationContext.HasNotifications)
        {
            return Task.FromResult<UserModel>(null);
        }

        var existingUser = _userRepository.GetById(request.Id);
        if (existingUser == null)
        {
            _notificationContext.AddNotification("User", "Usuário não encontrado");
            return Task.FromResult<UserModel?>(null);
        }

        existingUser.NomeUsuario = request.dto.NomeUsuario;
        existingUser.EmailUsuario = request.dto.EmailUsuario;
        existingUser.IdadeUsuario = request.dto.IdadeUsuario;
        existingUser.TelefoneUsuario = request.dto.TelefoneUsuario;
        existingUser.EnderecoUsuario = request.dto.EnderecoUsuario;
        existingUser.OutrasInformacoesUsuario = request.dto.OutrasInformacoesUsuario;
        existingUser.InteressesUsuario = request.dto.InteressesUsuario;
        existingUser.ValoresUsuario = request.dto.ValoresUsuario;
        existingUser.SentimentosUsuario = request.dto.SentimentosUsuario;
        existingUser.StatusUsuario = request.dto.StatusUsuario;
        existingUser.RevisadoUsuario = true;

        var updatedUser = _userRepository.Update(existingUser);
        return Task.FromResult(updatedUser);
    }
}
