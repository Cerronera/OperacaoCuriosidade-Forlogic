using MediatR;
using OperacaoCuriosidadeAPI.Features.AdminFeatures.Commands;
using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Notifications;
using OperacaoCuriosidadeAPI.Repositories; 
using OperacaoCuriosidadeAPI.Validators;

namespace OperacaoCuriosidadeAPI.Features.AdminFeatures.Handlers;

public class CreateAdminHandler : IRequestHandler<CreateAdminCommand, AdminModel>
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

    public Task<AdminModel> Handle(CreateAdminCommand request, CancellationToken cancellationToken)
    {
        _validator.Validate(request.dto);
        if (_notificationContext.HasNotifications)
        {
            return Task.FromResult<AdminModel>(null);
        }

        if (_adminRepository.EmailExists(request.dto.EmailAdmin))
        {
            _notificationContext.AddNotification("EmailAdmin", "Este e-mail já está em uso.");
            return Task.FromResult<AdminModel>(null);
        }

        var newAdmin = new AdminModel
        {
            AdminName = request.dto.NomeAdmin,
            AdminEmail = request.dto.EmailAdmin,
            AdminPassword = request.dto.SenhaAdmin,
            Role = request.dto.Role
        };

        var createdAdmin = _adminRepository.Create(newAdmin);
        return Task.FromResult(createdAdmin);
    }
}
