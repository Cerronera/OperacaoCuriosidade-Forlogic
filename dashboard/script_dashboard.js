//função de logout de admin

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

    //atualizar os blocos
    if (document.getElementById('bloco_1')) {
        atualizarBlocos();
    }

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

    //lógica do tema escuro:
    const trocarTemaCheckbox = document.getElementById('chk')
    const rootElement = document.documentElement

    if (trocarTemaCheckbox) {
        const temaAtual = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

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


