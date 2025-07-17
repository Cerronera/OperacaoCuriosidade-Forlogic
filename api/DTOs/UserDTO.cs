namespace OperacaoCuriosidadeAPI.DTOs;

public class UserDTO
{
    public string NomeUsuario { get; set; }
    public int IdadeUsuario { get; set; }
    public string EmailUsuario { get; set; }
    public string TelefoneUsuario  { get; set; }
    public string EnderecoUsuario { get; set; }
    public bool StatusUsuario { get; set; }

    public string? OutrasInformacoesUsuario { get; set; }
    public string? InteressesUsuario { get; set; }
    public string? ValoresUsuario { get; set; }
    public string? SentimentosUsuario { get; set; }
}
