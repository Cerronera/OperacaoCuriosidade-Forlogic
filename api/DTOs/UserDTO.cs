namespace OperacaoCuriosidadeAPI.DTOs;

public class UserDTO
{
    public required string NomeUsuario { get; set; }
    public required int IdadeUsuario { get; set; }
    public required string EmailUsuario { get; set; }
    public required string TelefoneUsuario  { get; set; }
    public required string EnderecoUsuario { get; set; }
    public bool StatusUsuario { get; set; }
    public string? OutrasInformacoesUsuario { get; set; }
    public string? InteressesUsuario { get; set; }
    public string? ValoresUsuario { get; set; }
    public string? SentimentosUsuario { get; set; }
}
