using OperacaoCuriosidadeAPI.Features.AdminFeatures.Commands;
using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Notifications;
using OperacaoCuriosidadeAPI.Repositories; 
using OperacaoCuriosidadeAPI.Validators;

namespace OperacaoCuriosidadeAPI.Features.AdminFeatures.Handlers;

public class CreateAdminHandler : ICreateAdminHandler
{
    private readonly IAdminRepository _adminRepository;
    private readonly AdminValidator _validator;
    private readonly NotificationContext _notificationContext;

    public CreateAdminHandler(IAdminRepository adminRepository, AdminValidator validator, NotificationContext notificationContext)
    {
        _adminRepository = adminRepository;
        _validator = validator;
        _notificationContext = notificationContext;
    }

    public async Task<AdminModel> Handle(CreateAdminCommand command, CancellationToken cancellationToken)
    {
        _validator.Validate(command.dto);
        if (_notificationContext.HasNotifications)
        {
            return null;
        }

        if (_adminRepository.EmailExists(command.dto.EmailAdmin))
        {
            _notificationContext.AddNotification("EmailAdmin", "Este e-mail já está em uso.");
            return null;
        }

        var newAdmin = new AdminModel
        {
            NomeAdmin = command.dto.NomeAdmin,
            EmailAdmin = command.dto.EmailAdmin,
            SenhaAdmin = command.dto.SenhaAdmin,
            Role = command.dto.Role
        };

        var createdAdmin = _adminRepository.Create(newAdmin);
        return createdAdmin;
    }
}
