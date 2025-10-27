namespace OperacaoCuriosidadeAPI.Notifications;

public class NotificationContext
{
    private readonly List<Notification> _notifications = new();
    public IReadOnlyCollection<Notification> Notifications => _notifications;
    public bool HasNotifications => _notifications.Any();

    public void AddNotification (string message, string descricao)
    {
        _notifications.Add(new Notification(message, descricao));
    }
}
