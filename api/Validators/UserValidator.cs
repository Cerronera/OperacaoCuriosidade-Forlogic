using System.Text.RegularExpressions;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Notifications;

namespace OperacaoCuriosidadeAPI.Validators;

public class UserValidator
{
    private readonly NotificationContext _notificationContext;

    public UserValidator(NotificationContext notificationContext)
    {
        _notificationContext = notificationContext;
    }
    public void Validate(UserDTO dto)
    {
        if(string.IsNullOrWhiteSpace(dto.NomeUsuario))
        {
            _notificationContext.AddNotification("nome", "O campo Nome é obrigatório");
        }

        if(dto.NomeUsuario.Length <= 3 || dto.NomeUsuario.Length >= 100)
        {
            _notificationContext.AddNotification("nome","O campo Nome deve ter entre 3 e 100 caracteres ");
        }

        if(!string.IsNullOrWhiteSpace(dto.NomeUsuario) && dto.NomeUsuario.Any(char.IsDigit))
        {
            _notificationContext.AddNotification("nome", "O campo Nome não pode conter números");
        }

        if(dto.IdadeUsuario <= 16 || dto.IdadeUsuario >= 100)
        {
            _notificationContext.AddNotification("idade","A idade deve ser entre 16 e 100 anos");
        }

        if(dto.EmailUsuario.Length <=3 || dto.EmailUsuario.Length >= 70)
        {
            _notificationContext.AddNotification("email", "O campo Email deve ter entre 3 e 70 caracteres ");
        }

        if (string.IsNullOrWhiteSpace(dto.EmailUsuario))
        {
            _notificationContext.AddNotification("email","O campo E-mail é obrigatório");
        }
        else
        {
            var regexEmail = new Regex(@"^[_.]?[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}(?:\.br)?$");
            if (!regexEmail.IsMatch(dto.EmailUsuario))
            {
                _notificationContext.AddNotification("email","O formato do E-mail fornecido é inválido");
            }
        }

        if (string.IsNullOrWhiteSpace(dto.TelefoneUsuario))
        {
            _notificationContext.AddNotification("telefone", "O campo Telefone é obrigatório");
        }
        else
        {
            var regexTelefone = new Regex(@"^\(?([1-9]{2})\)? ?(9?[0-9]{4})-?([0-9]{4})$");
            if (!regexTelefone.IsMatch(dto.TelefoneUsuario))
            {
                _notificationContext.AddNotification("telefone","O formato do Telefone fornecido é inválido");
            }
        }
            
        if (string.IsNullOrWhiteSpace(dto.EnderecoUsuario))
        {
            _notificationContext.AddNotification("endereco","O campo Endereço é obrigatório");
        }

        if(dto.EnderecoUsuario.Length <= 3 || dto.EnderecoUsuario.Length >= 500)
        {
            _notificationContext.AddNotification("endereco", "O campo Endereço deve ter entre 3 e 500 caracteres ");
        }

        if(!string.IsNullOrEmpty(dto.OutrasInformacoesUsuario) && dto.OutrasInformacoesUsuario.Length > 500)
        {
            _notificationContext.AddNotification("outras", "O campo Outras Informações deve ter no máximo 500 caracteres ");
        }

        if (!string.IsNullOrEmpty(dto.InteressesUsuario) && dto.InteressesUsuario.Length > 500)
        {
            _notificationContext.AddNotification("interesses", "O campo Interesses deve ter no máximo 500 caracteres ");
        }

        if (!string.IsNullOrEmpty(dto.ValoresUsuario) && dto.ValoresUsuario.Length > 500)
        {
            _notificationContext.AddNotification("valores", "O campo Valores deve ter no máximo 500 caracteres ");
        }

        if (!string.IsNullOrEmpty(dto.SentimentosUsuario) && dto.SentimentosUsuario.Length > 500)
        {
            _notificationContext.AddNotification("sentimentos", "O campo Sentimentos deve ter no máximo 500 caracteres ");
        }

    }
}
