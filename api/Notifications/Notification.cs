namespace OperacaoCuriosidadeAPI.Notifications;

public class Notification
{
    public string Message { get; }
    public string Descricao { get; }

    public Notification(string message, string descricao)
    {
        Message = message;
        Descricao = descricao;
    }
}
