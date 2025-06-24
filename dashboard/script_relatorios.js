
function voltar_login() {

    const confirmar = confirm("Você tem certeza que deseja sair?")

    if (confirmar) {
        sessionStorage.removeItem('adminLogado')
        alert("Você foi desconectado")
        window.location.href = '/login_cadastro/login.html'
    }
}

function voltar_home() {
    setTimeout(() => {
        window.location.href = '/dashboard/dashboard.html'
    }, 200);
}

function ir_relatorios() {
    setTimeout(() => {
        window.location.href = '/dashboard/relatorios.html'
    }, 200);
}

function ir_cadastros() {
    setTimeout(() => {
        window.location.href = '/dashboard/cadastros.html'
    }, 200);
}

document.addEventListener('DOMContentLoaded', () => {

    const btn_imp = document.getElementById('btn_imp')

    // carregar informações do admin
    function carregarAdmin() {
        const emailLogado = sessionStorage.getItem('adminLogado')

        //função pra bloquear acesso se nao tiver logado
        if (!emailLogado) {
            alert("Nenhum administrador logado. Por favor, faça o Login.")
            window.location.href = '../login_cadastro/login.html'
            return;
        }

        const admins = JSON.parse(localStorage.getItem('admins')) || [];

        const adminInfo = admins.find(admin => admin.email === emailLogado)

        if (adminInfo) {
            const nomeUsuario = document.querySelector('.usuario_nome')
            if (nomeUsuario) {
                nomeUsuario.textContent = adminInfo.nome
            }
        } else {
            alert("Erro ao carregar informações do Administrador.")
            window.location.href = '../login_cadastro/login.html'
        }
    }
    carregarAdmin()

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








