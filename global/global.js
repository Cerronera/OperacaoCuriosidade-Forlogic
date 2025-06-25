// Direcionamento de páginas:

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


/*menu hamburguer*/

const btnMobile = document.getElementById('btn_mobile')
const sidebar = document.querySelector('.sidebar')
const body = document.body

function toggleMenu(event) {

    if (event.type === 'touchstar') {
        event.preventDefault()
    }

    sidebar.classList.toggle('aberta')
    body.classList.toggle('menu-aberto')

    const menuAberto = sidebar.classList.contains('aberta')
    event.currentTarget.setAttribute('aria-expanded', menuAberto)
}

if (btnMobile) {
    btnMobile.addEventListener('click', toggleMenu)
    btnMobile.addEventListener('touchstart', toggleMenu)
}

body.addEventListener('click', (event) => {

    if (sidebar.classList.contains('aberta') && !sidebar.contains(event.target) && !btnMobile.contains(event.target)) {
        toggleMenu(event)
    }
});

/*botao busca mobile*/

const header = document.querySelector('header.dashboard')
const btnBusca = document.getElementById('btn_busca')
const btnFecharBusca = document.getElementById('btn_fechar_busca')

if (btnBusca) {
    btnBusca.addEventListener('click', () => {

        header.classList.add('busca-ativa')
        campoPesquisa.focus()
    });
}

if (btnFecharBusca) {
    btnFecharBusca.addEventListener('click', () => {
        header.classList.remove('busca-ativa')
    });
}


/*DOM*/

document.addEventListener('DOMContentLoaded', () => {


    function paginaAtiva() {

        const paginaAtual = window.location.pathname
        const linkSidebar = document.querySelectorAll('.sidebar li a')

        linkSidebar.forEach(link => {
            const aoAtivar = link.getAttribute('onclick')

            if (aoAtivar) {
                if (aoAtivar.includes('voltar_home') && paginaAtual.includes('dashboard.html')) {
                    link.classList.add('ativo')
                } else if (aoAtivar.includes('ir_cadastros') && paginaAtual.includes('cadastros.html')) {
                    link.classList.add('ativo')
                } else if (aoAtivar.includes('ir_relatorios') && paginaAtual.includes('relatorios.html')) {
                    link.classList.add('ativo')
                }
            }
        });
    }
    paginaAtiva()

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

});

/*Tabela */

//guardar o estado atual da tabela
let estadoTabela = {
    listaCompletaDeUsuarios: [],
    usuariosFiltrados: [],
    usuariosDaPagina: [],

    paginaAtual: 1,
    linhasPorPagina: 10,
    totalPaginas: 0,

    elementoTabelaBody: null,
    elementoPaginacao: null,
    elementoCampoPesquisa: null,
};

function renderizarLinhasTabela() {

    estadoTabela.elementoTabelaBody.innerHTML = ''

    if (estadoTabela.usuariosDaPagina.length === 0) {
        const termoBusca = estadoTabela.elementoCampoPesquisa.value
        const mensagem = termoBusca ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'
        estadoTabela.elementoTabelaBody.innerHTML = `
        <tr><td colspan="4">${mensagem}</td></tr>
        `;
        return
    }

    estadoTabela.usuariosDaPagina.forEach(usuario => {
        const tr = document.createElement('tr')
        const statusClass = usuario.status === 'Ativo' ? 'status-ativo' : 'status-inativo'

        tr.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.telefone}</td>
            <td class="status-cell">
            <span class="${statusClass}">${usuario.status}</span>
            </td>
        `;

        // Se uma função de clique foi configurada, adiciona o evento
        if (estadoTabela.config.onRowClick) {

            const originalIndex = estadoTabela.listaCompletaDeUsuarios.findIndex(
                u => u.email === usuario.email
            );

            tr.style.cursor = 'pointer'
            tr.addEventListener('click', () => {
                if (originalIndex !== 1) {
                    estadoTabela.config.onRowClick(usuario, originalIndex)
                }
            });
        }

        estadoTabela.elementoTabelaBody.appendChild(tr)
    });
}

//botões paginação
function renderizarBotoesDePaginacao() {
    if (!estadoTabela.elementoPaginacao) return;

    estadoTabela.elementoPaginacao.innerHTML = ''

    const criarBotao = (texto, acao) => {
        const btn = document.createElement('button')
        btn.innerHTML = texto

        // Desabilita o botão se a ação for nula 
        if (!acao) {
            btn.disabled = true
        } else {
            btn.addEventListener('click', () => {
                acao()
                // Após a ação, atualiza a tabela inteira
                atualizarDadosParaExibicao()
            });
        }
        btn.classList.add('paginacao-btn')
        return btn
    };

    const pag = estadoTabela.paginaAtual
    const total = estadoTabela.totalPaginas

    estadoTabela.elementoPaginacao.appendChild(criarBotao('&laquo;', pag > 1 ? () => estadoTabela.paginaAtual = 1 : null))
    estadoTabela.elementoPaginacao.appendChild(criarBotao('&lsaquo;', pag > 1 ? () => estadoTabela.paginaAtual-- : null))

    const info = document.createElement('span')
    info.textContent = `Página ${pag} de ${total || 1}`
    estadoTabela.elementoPaginacao.appendChild(info)

    estadoTabela.elementoPaginacao.appendChild(criarBotao('&rsaquo;', pag < total ? () => estadoTabela.paginaAtual++ : null))
    estadoTabela.elementoPaginacao.appendChild(criarBotao('&raquo;', pag < total ? () => estadoTabela.paginaAtual = total : null))
}

//busca
function atualizarDadosParaExibicao() {

    estadoTabela.listaCompletaDeUsuarios = JSON.parse(localStorage.getItem('usuarios')) || []
    const termoBusca = estadoTabela.elementoCampoPesquisa.value.toLowerCase().trim()

    //Filtra a lista completa com base na busca
    if (termoBusca) {
        estadoTabela.usuariosFiltrados = estadoTabela.listaCompletaDeUsuarios.filter(usuario =>
            usuario.nome.toLowerCase().includes(termoBusca)
        );
    } else {
        estadoTabela.usuariosFiltrados = estadoTabela.listaCompletaDeUsuarios;
    }

    // Calcula a paginação com base na lista filtrada
    estadoTabela.totalPaginas = Math.ceil(estadoTabela.usuariosFiltrados.length / estadoTabela.linhasPorPagina);
    const startIndex = (estadoTabela.paginaAtual - 1) * estadoTabela.linhasPorPagina;
    const endIndex = startIndex + estadoTabela.linhasPorPagina;
    estadoTabela.usuariosDaPagina = estadoTabela.usuariosFiltrados.slice(startIndex, endIndex);

    renderizarLinhasTabela();
    renderizarBotoesDePaginacao();
}

//quando algo é digitado na barra de pesquisa:
function handlePesquisa() {
    // Ao pesquisar, sempre voltamos para a primeira página
    estadoTabela.paginaAtual = 1;
    atualizarDadosParaExibicao();
}

//inicialização da tabela
function inicializarTabela(config) {

    estadoTabela.config = config

    estadoTabela.elementoTabelaBody = document.querySelector(config.tabelaSelector);
    estadoTabela.elementoPaginacao = document.getElementById(config.paginacaoId);
    estadoTabela.elementoCampoPesquisa = document.getElementById(config.campoPesquisaId);

    // Define as configurações específica ou seta elas como 10
    estadoTabela.linhasPorPagina = config.linhasPorPagina || 10;

    // Carrega os dados iniciais do localStorage
    estadoTabela.listaCompletaDeUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Configura os eventos
    if (estadoTabela.elementoCampoPesquisa) {
        estadoTabela.elementoCampoPesquisa.addEventListener('keyup', handlePesquisa);
    }

    atualizarDadosParaExibicao();

    // Adiciona um listener para atualizar a tabela se outra aba modificar os dados
    window.addEventListener('storage', () => {
        estadoTabela.listaCompletaDeUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        atualizarDadosParaExibicao();
    });
}
