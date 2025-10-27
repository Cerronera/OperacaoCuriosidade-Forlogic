using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace OperacaoCuriosidadeAPI.Common;

public interface IDispatcher
{
    Task<TResposta> SendAsync<TResposta>(ICommand<TResposta> command, CancellationToken cancellationToken = default);
    Task<TResposta> QueryAsync<TResposta>(IQuery<TResposta> query, CancellationToken cancellationToken = default);
}

public class Dispatcher : IDispatcher 
{
    private readonly IServiceProvider _serviceProvider;

    public Dispatcher(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public Task<TResposta> SendAsync<TResposta>(ICommand<TResposta> command, CancellationToken cancellationToken = default)
    {
        var commandType = command.GetType(); 
        var handlerType = typeof(ICommandHandler<,>).MakeGenericType(commandType,typeof(TResposta));
        var handler = _serviceProvider.GetRequiredService(handlerType);
        return (Task<TResposta>)handler.GetType().GetMethod("Handle").Invoke(handler, new object[] { command, cancellationToken });
    }

    public Task<TResposta> QueryAsync<TResposta>(IQuery<TResposta> query, CancellationToken cancellationToken = default)
    {
        var queryType = query.GetType();
        var handlerType = typeof(IQueryHandler<,>).MakeGenericType(queryType, typeof(TResposta));
        var handler = _serviceProvider.GetRequiredService(handlerType);
        return (Task<TResposta>)handler.GetType().GetMethod("Handle").Invoke(handler, new object[] { query, cancellationToken });
    }
}

