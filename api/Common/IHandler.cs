namespace OperacaoCuriosidadeAPI.Common;

public interface ICommandHandler<TCommand, TResposta> where TCommand : ICommand<TResposta>
{
    Task<TResposta> Handle(TCommand command, CancellationToken cancellationToken);
}

public interface IQueryHandler<TQuery, TResposta> where TQuery : IQuery<TResposta>
{
    Task<TResposta> Handle(TQuery query, CancellationToken cancellationToken);
}

