using Microsoft.IdentityModel.Tokens;
using OperacaoCuriosidadeAPI.Features.LoginFeatures.Commands;
using OperacaoCuriosidadeAPI.Repositories;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace OperacaoCuriosidadeAPI.Features.LoginFeatures.Handlers;

public class LoginHandler :ILoginHandler
{
    private readonly IAdminRepository _adminRepository;
    private readonly IConfiguration _config;

    public LoginHandler(IAdminRepository adminRepository, IConfiguration config)
    {
        _adminRepository = adminRepository;
        _config = config;
    }

    public async Task<string?> Handle(LoginCommand command, CancellationToken cancellationToken)
    {
        var currentAdmin = _adminRepository.GetByEmail(command.dto.EmailDigitado);
        if (currentAdmin == null || currentAdmin.SenhaAdmin != command.dto.SenhaDigitada)
        {
            return null;
        }

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, currentAdmin.NomeAdmin),
            new Claim(ClaimTypes.Email, currentAdmin.EmailAdmin),
            new Claim(ClaimTypes.Role, currentAdmin.Role.ToString())
        };

        var token = new JwtSecurityToken(
            _config["JwtSettings:Issuer"],
            _config["JwtSettings:Audience"],
            claims,
            expires: DateTime.Now.AddHours(8),
            signingCredentials: credentials);
        
        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return tokenString;
    }


}
