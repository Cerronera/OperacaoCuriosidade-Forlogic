document.addEventListener('DOMContentLoaded', () => {

    const btn_imp = document.getElementById('btn_imp')

    if (btn_imp) {
        btn_imp.addEventListener('click', () => {
            // Salva o estado atual
            const linhasPorPaginaOriginal = estadoTabela.linhasPorPagina
            const paginaAtualOriginal = estadoTabela.paginaAtual

            // Mostra todos os registros na hora de imprimir
            estadoTabela.linhasPorPagina = estadoTabela.listaCompletaDeUsuarios.length
            estadoTabela.paginaAtual = 1
            atualizarDadosParaExibicao()

            const agora = new Date()
            document.documentElement.setAttribute('data-print-date', agora.toLocaleDateString())
            document.documentElement.setAttribute('data-print-datetime', agora.toLocaleString())

            // Espera um pouco para renderizar antes de imprimir
            setTimeout(() => {
                window.print()

                // Restaura o estado original
                estadoTabela.linhasPorPagina = linhasPorPaginaOriginal
                estadoTabela.paginaAtual = paginaAtualOriginal
                atualizarDadosParaExibicao()

                // Remove os atributos 
                document.documentElement.removeAttribute('data-print-date')
                document.documentElement.removeAttribute('data-print-datetime')
            }, 200);
        });
    }

    const configTabelaPrincipal = {
        tabelaSelector: '#tabela_usuarios tbody',
        paginacaoId: 'paginacao',
        campoPesquisaId: 'campoPesquisa',
        linhasPorPagina: 20
    };

    inicializarTabela(configTabelaPrincipal)
});