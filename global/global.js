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

/*pagina ativa*/
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
        const tr = document.createElement('tr');
        const statusClass = usuario.status === 'Ativo' ? 'status-ativo' : 'status-inativo';

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

        // Desabilita o botão se a ação for nula (ex: não há página anterior)
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
        return btn;
    };

    const pag = estadoTabela.paginaAtual
    const total = estadoTabela.totalPaginas

    estadoTabela.elementoPaginacao.appendChild(criarBotao('&laquo;', pag > 1 ? () => estadoTabela.paginaAtual = 1 : null))
    estadoTabela.elementoPaginacao.appendChild(criarBotao('&lsaquo;', pag > 1 ? () => estadoTabela.paginaAtual-- : null))

    const info = document.createElement('span')
    info.textContent = `Página ${pag} de ${total || 1}`
    estadoTabela.elementoPaginacao.appendChild(info)

    estadoTabela.elementoPaginacao.appendChild(criarBotao('&rsaquo;', pag < total ? () => estadoTabela.paginaAtual++ : null));
    estadoTabela.elementoPaginacao.appendChild(criarBotao('&raquo;', pag < total ? () => estadoTabela.paginaAtual = total : null));
}

//busca
function atualizarDadosParaExibicao() {

    estadoTabela.listaCompletaDeUsuarios = JSON.parse(localStorage.getItem('usuarios')) || []
    const termoBusca = estadoTabela.elementoCampoPesquisa.value.toLowerCase().trim();

    // 1. Filtra a lista completa com base na busca
    if (termoBusca) {
        estadoTabela.usuariosFiltrados = estadoTabela.listaCompletaDeUsuarios.filter(usuario =>
            usuario.nome.toLowerCase().includes(termoBusca)
        );
    } else {
        estadoTabela.usuariosFiltrados = estadoTabela.listaCompletaDeUsuarios;
    }

    // 2. Calcula a paginação com base na lista já filtrada
    estadoTabela.totalPaginas = Math.ceil(estadoTabela.usuariosFiltrados.length / estadoTabela.linhasPorPagina);
    const startIndex = (estadoTabela.paginaAtual - 1) * estadoTabela.linhasPorPagina;
    const endIndex = startIndex + estadoTabela.linhasPorPagina;
    estadoTabela.usuariosDaPagina = estadoTabela.usuariosFiltrados.slice(startIndex, endIndex);

    // 3. Manda desenhar tudo na tela
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
    // Guarda as configurações para uso futuro
    estadoTabela.config = config;

    // Conecta as variáveis do "cérebro" com os elementos HTML reais da página
    estadoTabela.elementoTabelaBody = document.querySelector(config.tabelaSelector);
    estadoTabela.elementoPaginacao = document.getElementById(config.paginacaoId);
    estadoTabela.elementoCampoPesquisa = document.getElementById(config.campoPesquisaId);

    // Define as configurações específicas
    estadoTabela.linhasPorPagina = config.linhasPorPagina || 10;

    // Carrega os dados iniciais do localStorage
    estadoTabela.listaCompletaDeUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Configura os eventos
    if (estadoTabela.elementoCampoPesquisa) {
        estadoTabela.elementoCampoPesquisa.addEventListener('keyup', handlePesquisa);
    }

    // Faz a primeira "foto" dos dados e mostra na tela
    atualizarDadosParaExibicao();

    // Adiciona um listener para atualizar a tabela se outra aba modificar os dados
    window.addEventListener('storage', () => {
        estadoTabela.listaCompletaDeUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        atualizarDadosParaExibicao();
    });
}
