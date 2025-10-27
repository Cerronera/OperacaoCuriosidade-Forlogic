namespace OperacaoCuriosidadeAPI.DTOs;

public class PaginacaoDTO<T>
{
    public List<T> Itens { get; set; }
    public int NumeroPag { get; set; }
    public int TotalPag { get; set; }
    public int TotalCount { get; set; }
}
