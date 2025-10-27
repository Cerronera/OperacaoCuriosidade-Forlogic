using System.Text.Json;
using OperacaoCuriosidadeAPI.DTOs;
using OperacaoCuriosidadeAPI.Models;

namespace OperacaoCuriosidadeAPI.Repositories;

public class UserRepository : IUserRepository
{
    private readonly string _dadosMockadosPath;

    private static List<UserModel> _users;
    private static int _nextId = 1;

    private static readonly object _locker = new object();
    
    public UserRepository()
    {
        _dadosMockadosPath = Path.Combine(AppContext.BaseDirectory, "data", "usuarios.json");

        var directory = Path.GetDirectoryName(_dadosMockadosPath);
        if (!Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }

        lock (_locker)
        {
            if (File.Exists(_dadosMockadosPath))
            {
                var json = File.ReadAllText(_dadosMockadosPath);
                _users = JsonSerializer.Deserialize<List<UserModel>>(json) ?? new List<UserModel>();
            }
            else
            {
                _users = new List<UserModel>();
            }
        }

        _nextId = _users.Any() ? _users.Max(u => u.Id) + 1 : 1;
    }

    private void SaveChanges()
    {
        lock (_locker)
        {
            var json = JsonSerializer.Serialize(_users, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_dadosMockadosPath, json);
        }
    }

    public UserModel Create (UserModel user)
    {
        user.Id = _nextId++;
        _users.Add(user);
        SaveChanges();
        return user;
    }
    public void Delete(int id)
    {
        var user = GetById(id);
        if (user != null)
        {
            _users.Remove(user);
            SaveChanges();
        }
    }

    public bool EmailExists(string email)
    {
        return _users.Any(u => u.EmailUsuario.ToLower() == email.ToLower());
    }

    public IEnumerable<UserModel> GetAll()
    {
        return _users;
    }

    public UserModel? GetById(int id)
    {
        return _users.FirstOrDefault(u => u.Id == id);
    }

    public UserModel? Update(UserModel user)
    {
        var index = _users.FindIndex(u => u.Id == user.Id);
            if(index != -1)
        {
            _users[index] = user;
            SaveChanges();
            return user;
        }
        return null;
    }

    public PaginacaoDTO<UserModel> GetPaginacaoUsers(int numeroPag, int registrosPag, string filtro, string sortBy, string sortDirection, string busca)
    {
        IEnumerable<UserModel> query = _users;

        if (!string.IsNullOrEmpty(filtro))  
        {
            switch (filtro.ToLower()) 
            {
                case "pendentes":
                    query = query.Where(u => u.RevisadoUsuario == false);
                    break;
                case "ultimomes": 
                    var trintaDiasAtras = DateTime.UtcNow.AddDays(-30);
                    query = query.Where(u => u.DataCadastro >= trintaDiasAtras);
                    break;
            }
        }

        if (!string.IsNullOrEmpty(busca))
        {
            query = query.Where(u => u.NomeUsuario.ToLower().Contains(busca.ToLower()));
        }

        if (!string.IsNullOrEmpty(sortBy))
        {
            bool isDesc = sortDirection.ToLower() == "desc";

            if(sortBy.ToLower() == "nome")
            {
                query = isDesc
                    ? query.OrderByDescending(u => u.NomeUsuario)
                    : query.OrderBy(u => u.NomeUsuario);
            }

            else if(sortBy.ToLower() == "datacadastro")
            {
                query = isDesc
                   ? query.OrderByDescending(u => u.DataCadastro)
                   : query.OrderBy(u => u.DataCadastro);
            }
        }

        var usuariosFiltrados = query.ToList();
        var totalCount = usuariosFiltrados.Count();
        List<UserModel> itens;
        int totalPag;

        if(registrosPag <= 0)
        {
            itens = usuariosFiltrados;
            totalPag = 1;
        }
        else
        {
            itens = usuariosFiltrados.Skip((numeroPag - 1) * registrosPag).Take(registrosPag).ToList();
            totalPag = (int)Math.Ceiling(totalCount / (double)registrosPag);
        }

            return new PaginacaoDTO<UserModel>
            {
                Itens = itens,
                NumeroPag = numeroPag,
                TotalCount = totalCount,
                TotalPag = totalPag
            };
    }
}
