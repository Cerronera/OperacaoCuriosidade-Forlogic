using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Models;
using OperacaoCuriosidadeAPI.Services;

namespace OperacaoCuriosidadeAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IAdminService _adminService;

    public LoginController(IConfiguration config, IAdminService adminService)
    {
        _config = config;
        _adminService = adminService;
    }

    [AllowAnonymous]
    [HttpPost]
    public IActionResult Login([FromBody] LoginDTO dto)
    {
        var admin = Authenticate(dto);

        if(admin != null)
        {
            var token = Generate(admin);
            return Ok(token);
        }
        return Unauthorized("E-mail ou Senha incorretos");
    }

    private string Generate(AdminModel admin)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, admin.AdminName),
            new Claim(ClaimTypes.Email, admin.AdminEmail),
            new Claim(ClaimTypes.Role, admin.Role.ToString())
        };

        var token = new JwtSecurityToken(
            _config["JwtSettings:Issuer"],
            _config["JwtSettings:Audience"],
            claims,
            expires: DateTime.Now.AddMinutes(15), 
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);

    }

    private AdminModel? Authenticate(LoginDTO dto)
    {
        var currentAdmin = _adminService.GetByEmail(dto.EmailDigitado);
        if(currentAdmin != null && currentAdmin.AdminPassword == dto.SenhaDigitada)
        {
            return currentAdmin;
        }
        return null;
    }
}
