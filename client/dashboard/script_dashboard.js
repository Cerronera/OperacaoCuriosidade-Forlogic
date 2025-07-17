document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById('bloco_1')) {
        atualizarBlocos();
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
        manterAlturaTabela: true
    };

    inicializarTabela(configTabelaPrincipal)
});


