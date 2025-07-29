document.addEventListener('DOMContentLoaded', () => {

    const btn_imp = document.getElementById('btn_imp')

    if (btn_imp) {
        btn_imp.addEventListener('click', async () => {
            btn_imp.innerText = 'Gerando Relatório...'
            btn_imp.disabled = true;

            try {
                const parametros = new URLSearchParams();
                const filtro = sessionStorage.getItem('filtroTabela');
                if (filtro && filtro !== 'todos') {
                    parametros.append('filtro', filtro);
                }

                parametros.append('registrosPag', '-1');

                const resposta = await fetch(`${API_BASE_URL}/api/User?${parametros.toString()}`, {
                    headers: getAuthenticationHeaders()
                });

                if (!resposta.ok) {
                    throw new Error("Falha ao gerar relatório");
                }

                const dadosCompletos = await resposta.json();
                console.log(dadosCompletos);
                console.log(dadosCompletos.itens);

                const paginaAtualOriginal = [...estadoTabela.usuariosDaPagina];
                estadoTabela.usuariosDaPagina = dadosCompletos.itens || [];
                renderizarLinhasTabela();

                const agora = new Date()
                document.documentElement.setAttribute('data-print-date', agora.toLocaleDateString())
                document.documentElement.setAttribute('data-print-datetime', agora.toLocaleString())

                window.print();

                estadoTabela.usuariosDaPagina = paginaAtualOriginal;
                renderizarLinhasTabela();
                document.documentElement.removeAttribute('data-print-date')
                document.documentElement.removeAttribute('data-print-datetime')

            } catch (error) {
                console.error("Erro ao gerar relatório", error);
                mostrarSnackbar('Não foi possível gerar o relatório', 'erro')
            } finally {
                btn_imp.innerText = 'IMPRIMIR';
                btn_imp.disabled = false;
            }
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