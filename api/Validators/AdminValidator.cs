using System.Text.RegularExpressions;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Notifications;

namespace OperacaoCuriosidadeAPI.Validators;

public class AdminValidator
{
    private readonly NotificationContext _notificationContext;

    public AdminValidator(NotificationContext notificationContext)
    {
        _notificationContext = notificationContext;
    }

    public void Validate(AdminDTO dto)
    {
        if (string.IsNullOrWhiteSpace(dto.NomeAdmin))
        {
            _notificationContext.AddNotification("nomeAdmin", "O campo Nome é obrigatório");
        }

        if (dto.NomeAdmin.Length <= 3 || dto.NomeAdmin.Length >= 100)
        {
            _notificationContext.AddNotification("nomeAdmin", "O campo Nome deve ter entre 3 e 100 caracteres ");
        }

        if (string.IsNullOrWhiteSpace(dto.EmailAdmin))
        {
            _notificationContext.AddNotification("emailAdmin", "O campo E-mail é obrigatório");
        }
        else
        {
            var regexEmail = new Regex(@"^[_.]?[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}(?:\.br)?$");
            if (!regexEmail.IsMatch(dto.EmailAdmin))
            {
                _notificationContext.AddNotification("emailAdmin", "O formato do E-mail fornecido é inválido");
            }
        }

        if (string.IsNullOrWhiteSpace(dto.SenhaAdmin))
        {
            _notificationContext.AddNotification("senhaAdmin", "O campo Senha é obrigatório");
        }

        if(dto.SenhaAdmin.Length < 8)
        {
            _notificationContext.AddNotification("senhaAdmin", "A Senha deve ter pelo menos 8 caracteres");
        }
    }
}
