using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Services;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Validators;
using OperacaoCuriosidadeAPI.Notifications;

namespace OperacaoCuriosidadeAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;
    private readonly AdminValidator _adminValidator; 
    private readonly NotificationContext _notificationContext; 

    public AdminController(IAdminService adminService, AdminValidator adminValidator, NotificationContext notificationContext)
    {
        _adminService = adminService;
        _adminValidator = adminValidator;
        _notificationContext = notificationContext;
    }

    [HttpPost("create")]
    [Authorize(Policy = "Administrator")]
    public IActionResult Create (AdminDTO dto)
    {
        _adminValidator.Validate(dto);
        if (_notificationContext.HasNotifications)
        {
            return BadRequest(_notificationContext.Notifications);
        }

        if (_adminService.EmailExists(dto.EmailAdmin))
        {
            return Conflict(new { message = "Este e-mail já está em uso." });
        }

        var newAdmin = new AdminModel
        {
            AdminName = dto.NomeAdmin,
            AdminEmail = dto.EmailAdmin,
            AdminPassword = dto.SenhaAdmin,
            Role = dto.Role
        };

        var createdAdmin = _adminService.Create(newAdmin);

      var response = new
        {
            createdAdmin.Id,
            createdAdmin.AdminName,
            createdAdmin.AdminEmail,
            createdAdmin.Role
        };
        return CreatedAtAction(nameof(Create), new { id = createdAdmin.Id }, response);
    }
}
