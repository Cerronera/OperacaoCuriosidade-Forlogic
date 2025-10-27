document.addEventListener('DOMContentLoaded', () => {

    function filtroBlocos() {
        const filtroAtivo = sessionStorage.getItem('filtroTabela') || 'todos';

        document.querySelectorAll('.bloco').forEach(bloco => {
            bloco.classList.remove('bloco-ativo')
        });

        if (filtroAtivo === 'todos') {
            document.getElementById('bloco_1')?.classList.add('bloco-ativo');
        } else if (filtroAtivo === 'ultimoMes') {
            document.getElementById('bloco_2')?.classList.add('bloco-ativo');
        } else if (filtroAtivo === 'pendentes') {
            document.getElementById('bloco_3')?.classList.add('bloco-ativo');
        }
    }

    function definirFiltro(filtro) {
        sessionStorage.setItem('filtroTabela', filtro);
        filtroBlocos();

        if (typeof estadoTabela !== 'undefined') {
            estadoTabela.paginaAtual = 1;
            localStorage.setItem('paginaAtualTabela', 1);
        }

        if (typeof atualizarDadosParaExibicao === 'function') {
            atualizarDadosParaExibicao();
        } else {
            console.error('Função não encontrada');
        }
    }

    const bloco1 = document.getElementById('bloco_1');
    const bloco2 = document.getElementById('bloco_2');
    const bloco3 = document.getElementById('bloco_3');

    if (bloco1) {
        bloco1.addEventListener('click', () => definirFiltro('todos'));
        bloco2.addEventListener('click', () => definirFiltro('ultimoMes'));
        bloco3.addEventListener('click', () => definirFiltro('pendentes'));
        atualizarBlocos();
        filtroBlocos();
    }


    const snackbarMessage = sessionStorage.getItem('snackbarMessage')
    if (snackbarMessage) {
        mostrarSnackbar(snackbarMessage, 'sucesso');
        sessionStorage.removeItem('snackbarMessage')
    }

    const trocarTemaCheckbox = document.getElementById('chk')

    if (trocarTemaCheckbox) {

        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            trocarTemaCheckbox.checked = true
        }

        trocarTemaCheckbox.addEventListener('change', () => {
            if (trocarTemaCheckbox.checked) {
                document.documentElement.setAttribute('data-theme', 'dark')
                localStorage.setItem('theme', 'dark')
            } else {
                document.documentElement.removeAttribute('data-theme')
                localStorage.setItem('theme', 'light')
            }
        });
    }

    setTimeout(() => {
        document.body.classList.add('transicao-ativa')
    }, 100);

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


