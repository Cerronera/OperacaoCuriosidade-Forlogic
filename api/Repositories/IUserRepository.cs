using System.Globalization;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Repositories;

public interface IUserRepository
{
    IEnumerable<UserModel> GetAll();
    UserModel? GetById(int id);
    UserModel Create(UserModel user);
    UserModel? Update(UserModel user);
    void Delete(int id);
    bool EmailExists(string email);
    PaginacaoDTO<UserModel> GetPaginacaoUsers(int numeroPag, int registrosPag, string filtro, string sortBy, string sortDirection, string busca);
}
