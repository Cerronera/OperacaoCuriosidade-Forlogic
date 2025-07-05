document.addEventListener('DOMContentLoaded', () => {

    const btn_imp = document.getElementById('btn_imp')

    if (btn_imp) {
        btn_imp.addEventListener('click', () => {
            const linhasPorPaginaOriginal = estadoTabela.linhasPorPagina
            const paginaAtualOriginal = estadoTabela.paginaAtual

            estadoTabela.linhasPorPagina = estadoTabela.listaCompletaDeUsuarios.length
            estadoTabela.paginaAtual = 1
            atualizarDadosParaExibicao()

            const agora = new Date()
            document.documentElement.setAttribute('data-print-date', agora.toLocaleDateString())
            document.documentElement.setAttribute('data-print-datetime', agora.toLocaleString())

            setTimeout(() => {
                window.print()

                estadoTabela.linhasPorPagina = linhasPorPaginaOriginal
                estadoTabela.paginaAtual = paginaAtualOriginal
                atualizarDadosParaExibicao()

                document.documentElement.removeAttribute('data-print-date')
                document.documentElement.removeAttribute('data-print-datetime')
            }, 200);
        });
    }

    const configTabelaPrincipal = {
        tabelaSelector: '#tabela_usuarios tbody',
        paginacaoId: 'paginacao',
        campoPesquisaId: 'campoPesquisa',
        linhasPorPagina: 10,
        manterAlturaTabela: true,
        mostrarDataCadastro: true
    };

    inicializarTabela(configTabelaPrincipal)
});