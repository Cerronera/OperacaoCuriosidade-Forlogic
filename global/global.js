function voltar_login() {
    if (window.ativarConfirmacao) {
        ativarConfirmacao("Confirmar Saída", "Você tem certeza que deseja sair?")
            .then(confirmado => {
                if (confirmado) {
                    sessionStorage.removeItem('adminLogado');
                    window.location.href = '/login_cadastro/login.html';
                }
            })
            .catch(() => {
                if (confirm("Erro no sistema. Deseja sair mesmo assim?")) {
                    sessionStorage.removeItem('adminLogado');
                    window.location.href = '/login_cadastro/login.html';
                }
            });
    }
}

function voltar_home() {
    setTimeout(() => {
        window.location.href = '/dashboard/dashboard.html'
    }, 200);
}

function ir_relatorios() {
    setTimeout(() => {
        window.location.href = '/relatorios/relatorios.html'
    }, 200);
}

function ir_cadastros() {
    setTimeout(() => {
        window.location.href = '/cadastros/cadastros.html'
    }, 200);
}

const btnMobile = document.getElementById('btn_mobile')
const sidebar = document.querySelector('.sidebar')
const body = document.body

function toggleMenu(event) {

    if (event.type === 'touchstart') {
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

function carregarAdmin() {
    const emailLogado = sessionStorage.getItem('adminLogado')
    const admins = JSON.parse(localStorage.getItem('admins')) || [];
    const adminInfo = admins.find(admin => admin.email === emailLogado)

    if (adminInfo) {
        const nomeUsuario = document.querySelector('.usuario_nome')
        if (nomeUsuario) {
            nomeUsuario.textContent = adminInfo.nome
        }
    } else {
        sessionStorage.removeItem('adminLogado')
        window.location.href = '../login_cadastro/login.html'
    }
}

function padronizarNome(nome) {
    if (!nome) {
        return ''
    }
    const palavras = nome.toLowerCase().split(' ')
    const palavrasNome = palavras.map(palavra => {
        if (['de', 'da', 'do', 'dos', 'e'].includes(palavra)) {
            return palavra
        }
        return palavra.charAt(0).toUpperCase() + palavra.slice(1)
    });
    return palavrasNome.join(' ')
}

function formatarData(dataString){
    if(!dataString){
        return ''
    }
    const data = new Date(dataString)

    const dia = String(data.getUTCDate()).padStart(2, '0')
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0')
    const ano = data.getUTCFullYear()

    return `${dia}/${mes}/${ano}`
}

document.addEventListener('DOMContentLoaded', () => {

    carregarAdmin()

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
    const tabelaBody = estadoTabela.elementoTabelaBody
    tabelaBody.innerHTML = ''

    const usuariosDaPagina = estadoTabela.usuariosDaPagina;
    const config = estadoTabela.config;

    if (usuariosDaPagina.length === 0) {
        const termoBusca = estadoTabela.elementoCampoPesquisa.value
        const mensagem = termoBusca ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'
        const numColunas = tabelaBody.parentElement.querySelector('thead tr').childElementCount || 4
        tabelaBody.innerHTML = `
        <tr><td colspan="${numColunas}">${mensagem}</td></tr>`;
        return;
    }

    usuariosDaPagina.forEach(usuario => {
        const tr = document.createElement('tr')
        const status = usuario.status === 'Ativo' ? 'status-ativo' : 'status-inativo'

        tr.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.telefone}</td>
            <td class="status-cell"><span class="${status}">${usuario.status}</span></td>
        `;

        if (config.mostrarColunaAcoes) {
            const acoesTd = document.createElement('td')
            acoesTd.className = 'acoes_modal'

            const containerExcluir = document.createElement('div')
            containerExcluir.classList.add('acoes_excluir')

            const btnExcluir = document.createElement('button')
            btnExcluir.type = 'button'
            btnExcluir.className = 'btn_delete'
            btnExcluir.innerHTML = `<i class="fas fa-trash-alt"></i>`

            btnExcluir.addEventListener('click', (event) => {
                event.stopPropagation()

                if (typeof config.onDeleteClick === 'function') {
                    config.onDeleteClick(usuario)
                }
            });

            containerExcluir.appendChild(btnExcluir)
            acoesTd.appendChild(containerExcluir)
            tr.appendChild(acoesTd)
        }

        if(config.mostrarDataCadastro){
            const dataTd = document.createElement('td')
            dataTd.textContent = formatarData(usuario.dataCadastro)
            tr.appendChild(dataTd)
        }

        if (config.onRowClick) {
            const originalIndex = estadoTabela.listaCompletaDeUsuarios.findIndex(
                u => u.email === usuario.email
            );

            tr.style.cursor = 'pointer'

            tr.addEventListener('click', () => {
                if (originalIndex !== -1) {
                    config.onRowClick(usuario, originalIndex)
                }
            });
        }
        tabelaBody.appendChild(tr)
    });

    if (config.manterAlturaTabela) {
        const linhasRenderizadas = usuariosDaPagina.length
        const linhasPorPagina = estadoTabela.linhasPorPagina

        const linhasVazias = linhasPorPagina - linhasRenderizadas

        if (linhasVazias > 0) {
            for (let i = 0; i < linhasVazias; i++) {
                const trVazia = document.createElement('tr')
                trVazia.classList.add('linha_fantasma')
                trVazia.innerHTML = '<td colspan = "100%">&nbsp;</td>'
                trVazia.style.height = '38px';
                tabelaBody.appendChild(trVazia)
            }
        }
    }
}


function renderizarBotoesDePaginacao() {
    if (!estadoTabela.elementoPaginacao) return;

    estadoTabela.elementoPaginacao.innerHTML = ''

    const criarBotao = (texto, acao) => {
        const btn = document.createElement('button')
        btn.innerHTML = texto

        if (!acao) {
            btn.disabled = true
        } else {
            btn.addEventListener('click', () => {
                acao()
                atualizarDadosParaExibicao()
            });
        }
        btn.classList.add('paginacao-btn')
        return btn
    };

    const pag = estadoTabela.paginaAtual
    const total = estadoTabela.totalPaginas

    estadoTabela.elementoPaginacao.appendChild(criarBotao('<<', pag > 1 ? () => estadoTabela.paginaAtual = 1 : null))
    estadoTabela.elementoPaginacao.appendChild(criarBotao('<', pag > 1 ? () => estadoTabela.paginaAtual-- : null))

    const info = document.createElement('span')
    info.textContent = `Página ${pag} de ${total || 1}`
    estadoTabela.elementoPaginacao.appendChild(info)

    estadoTabela.elementoPaginacao.appendChild(criarBotao('>', pag < total ? () => estadoTabela.paginaAtual++ : null))
    estadoTabela.elementoPaginacao.appendChild(criarBotao('>>', pag < total ? () => estadoTabela.paginaAtual = total : null))
}

function atualizarDadosParaExibicao() {

    estadoTabela.listaCompletaDeUsuarios = JSON.parse(localStorage.getItem('usuarios')) || []
    const termoBusca = estadoTabela.elementoCampoPesquisa.value.toLowerCase().trim()

    if (termoBusca) {
        estadoTabela.usuariosFiltrados = estadoTabela.listaCompletaDeUsuarios.filter(usuario =>
            usuario.nome.toLowerCase().includes(termoBusca)
        );
    } else {
        estadoTabela.usuariosFiltrados = estadoTabela.listaCompletaDeUsuarios;
    }

    estadoTabela.totalPaginas = Math.ceil(estadoTabela.usuariosFiltrados.length / estadoTabela.linhasPorPagina);
    const startIndex = (estadoTabela.paginaAtual - 1) * estadoTabela.linhasPorPagina;
    const endIndex = startIndex + estadoTabela.linhasPorPagina;
    estadoTabela.usuariosDaPagina = estadoTabela.usuariosFiltrados.slice(startIndex, endIndex);

    renderizarLinhasTabela();
    renderizarBotoesDePaginacao();
}

function handlePesquisa() {
    estadoTabela.paginaAtual = 1;
    atualizarDadosParaExibicao();
}

function inicializarTabela(config) {

    estadoTabela.config = config

    estadoTabela.elementoTabelaBody = document.querySelector(config.tabelaSelector);
    estadoTabela.elementoPaginacao = document.getElementById(config.paginacaoId);
    estadoTabela.elementoCampoPesquisa = document.getElementById(config.campoPesquisaId);

    estadoTabela.linhasPorPagina = config.linhasPorPagina || 10;

    estadoTabela.listaCompletaDeUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    if (estadoTabela.elementoCampoPesquisa) {
        estadoTabela.elementoCampoPesquisa.addEventListener('keyup', handlePesquisa);
    }

    atualizarDadosParaExibicao();

    window.addEventListener('storage', () => {
        estadoTabela.listaCompletaDeUsuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        atualizarDadosParaExibicao();
    });
}