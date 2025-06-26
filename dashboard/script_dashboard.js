document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById('bloco_1')) {
        atualizarBlocos();
    }

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
    
    const configTabelaPrincipal = {
        tabelaSelector: '#tabela_usuarios tbody',
        paginacaoId: 'paginacao',
        campoPesquisaId: 'campoPesquisa',
        linhasPorPagina: 10
    };

    inicializarTabela(configTabelaPrincipal)
});


