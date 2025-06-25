document.addEventListener('DOMContentLoaded', () => {

    //atualizar os blocos
    if (document.getElementById('bloco_1')) {
        atualizarBlocos();
    }

    //lógica do tema escuro:
    const trocarTemaCheckbox = document.getElementById('chk')
    const rootElement = document.documentElement

    if (trocarTemaCheckbox) {
        const temaAtual = localStorage.getItem('theme')

        if (temaAtual === 'dark') {
            trocarTemaCheckbox.checked = true
        }

        trocarTemaCheckbox.addEventListener('change', () => {
            if (trocarTemaCheckbox.checked) {
                rootElement.setAttribute('data-theme', 'dark')
                localStorage.setItem('theme', 'dark')
            } else {
                rootElement.removeAttribute('data-theme')
                localStorage.setItem('theme', 'light')
            }
        });
    }

    //chamar a tabela:
    const configTabelaPrincipal = {
        tabelaSelector: '#tabela_usuarios tbody',
        paginacaoId: 'paginacao',
        campoPesquisaId: 'campoPesquisa',
        linhasPorPagina: 10
    };

    inicializarTabela(configTabelaPrincipal)
});


