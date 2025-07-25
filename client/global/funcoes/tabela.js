function debounce(funcao, delay) {
    let debounceTimer;

    return function () {
        const context = this;
        const args = arguments;

        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            funcao.apply(context, args);
        }, delay)
    };
}


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
    ordenarPor: null,
};

function renderizarLinhasTabela() {
    const tabelaBody = estadoTabela.elementoTabelaBody
    if (!tabelaBody) {
        return;
    }

    tabelaBody.innerHTML = ''

    const usuariosDaPagina = estadoTabela.usuariosDaPagina;
    const config = estadoTabela.config;

    if (usuariosDaPagina.length === 0) {
        const termoBusca = estadoTabela.elementoCampoPesquisa.value
        const mensagem = termoBusca ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'
        const numColunas = tabelaBody.parentElement.querySelector('thead tr').childElementCount || 5
        tabelaBody.innerHTML = `
        <tr><td colspan="${numColunas}">${mensagem}</td></tr>`;
    } else {
        usuariosDaPagina.forEach(usuario => {
            const tr = document.createElement('tr')
            const statusClass = usuario.statusUsuario ? 'status-ativo' : 'status-inativo';
            const statusTexto = usuario.statusUsuario ? 'Ativo' : 'Inativo';

            tr.innerHTML = `
            <td>${usuario.nomeUsuario}</td>
            <td>${usuario.emailUsuario}</td>
            <td>${usuario.telefoneUsuario}</td>
            <td class="status-cell"><span class="${statusClass}">${statusTexto}</span></td>
        `;

            if (config.mostrarDataCadastro) {
                const dataTd = document.createElement('td')
                dataTd.textContent = formatarData(usuario.dataCadastro)
                tr.appendChild(dataTd)
            }

            if (config.mostrarColunaAcoes) {
                const acoesTd = document.createElement('td')
                acoesTd.className = 'acoes_modal'

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
                acoesTd.appendChild(btnExcluir)
                tr.appendChild(acoesTd)
            }

            if (config.onRowClick) {
                tr.style.cursor = 'pointer'
                tr.addEventListener('click', () => {
                    config.onRowClick(usuario);
                });
            }
            tabelaBody.appendChild(tr)
        });
    }

    if (config.manterAlturaTabela) {
        const linhasRenderizadas = usuariosDaPagina.length
        const linhasPorPagina = estadoTabela.linhasPorPagina
        const linhasVazias = linhasPorPagina - linhasRenderizadas

        if (linhasVazias > 0) {
            const numColunas = tabelaBody.parentElement.querySelector('thead tr').childElementCount || 5
            for (let i = 0; i < linhasVazias; i++) {
                const trVazia = document.createElement('tr')
                trVazia.classList.add('linha_fantasma')
                trVazia.innerHTML = `<td colspan="${numColunas}">&nbsp;</td>`;
                trVazia.style.height = '38px';
                tabelaBody.appendChild(trVazia)
            }
        }
    }
}

function renderizarBotoesDePaginacao() {
    if (!estadoTabela.elementoPaginacao) {
        return;
    }
    estadoTabela.elementoPaginacao.innerHTML = ''

    const criarBotao = (texto, acao) => {
        const btn = document.createElement('button')
        btn.innerHTML = texto

        if (!acao) {
            btn.disabled = true
        } else {
            btn.addEventListener('click', () => {
                acao()
                filtrarEPaginarDados();
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

function filtrarEPaginarDados() {
    const filtroAtivo = sessionStorage.getItem('filtroTabela') || 'todos';
    let usuariosFiltrados = [];

    switch (filtroAtivo) {
        case 'ultimoMes':
            const hoje = new Date();
            const mesAtras = new Date(hoje);
            mesAtras.setMonth(mesAtras.getMonth() - 1);
            usuariosFiltrados = estadoTabela.listaCompletaDeUsuarios.filter(usuario => {
                if (!usuario.dataCadastro) return false;
                const dataCadastro = new Date(usuario.dataCadastro);
                return dataCadastro >= mesAtras && dataCadastro <= hoje;
            });
            break;

        case 'pendentes':
            usuariosFiltrados = estadoTabela.listaCompletaDeUsuarios.filter(usuario => !usuario.revisadoUsuario);
            break;

        case 'todos':
        default:
            usuariosFiltrados = estadoTabela.listaCompletaDeUsuarios;
            break;
    }

    const termoBusca = estadoTabela.elementoCampoPesquisa.value.toLowerCase().trim()

    if (termoBusca) {
        estadoTabela.usuariosFiltrados = usuariosFiltrados.filter(usuario =>
            usuario.nomeUsuario.toLowerCase().includes(termoBusca)
        );
    } else {
        estadoTabela.usuariosFiltrados = usuariosFiltrados;
    }

    estadoTabela.totalPaginas = Math.ceil(estadoTabela.usuariosFiltrados.length / estadoTabela.linhasPorPagina);
    if (estadoTabela.paginaAtual > estadoTabela.totalPaginas) {
        estadoTabela.paginaAtual = estadoTabela.totalPaginas || 1
    }

    const startIndex = (estadoTabela.paginaAtual - 1) * estadoTabela.linhasPorPagina;
    const endIndex = startIndex + estadoTabela.linhasPorPagina;
    estadoTabela.usuariosDaPagina = estadoTabela.usuariosFiltrados.slice(startIndex, endIndex);

    renderizarLinhasTabela();
    renderizarBotoesDePaginacao();
}


async function atualizarDadosParaExibicao() {
    try {
        const resposta = await fetch(`${API_BASE_URL}/api/User`, {
            headers: getAuthenticationHeaders()
        });

        if (!resposta.ok) {
            if (resposta.status === 401) {
                mostrarSnackbar('Sessão Expirada ,Por favor faça Login novamente', 'erro', () => {
                    window.location.href = '/login_cadastro/login.html'
                });
            }
            return;
        }

        estadoTabela.listaCompletaDeUsuarios = await resposta.json()

        filtrarEPaginarDados();


    } catch (error) {
        console.error('Erro ao buscar usuários', error);
        mostrarSnackbar('Não foi possível buscar os dados da tabela.', 'erro');
    }
    checarSnackbar();
}

function inicializarTabela(config) {

    estadoTabela.config = config

    estadoTabela.elementoTabelaBody = document.querySelector(config.tabelaSelector);
    estadoTabela.elementoPaginacao = document.getElementById(config.paginacaoId);
    estadoTabela.elementoCampoPesquisa = document.getElementById(config.campoPesquisaId);
    estadoTabela.linhasPorPagina = config.linhasPorPagina || 10;

    if (estadoTabela.elementoCampoPesquisa) {
        const acaoPesquisa = () => {
            filtrarEPaginarDados();
        };
        const pesquisaDebounced = debounce(acaoPesquisa, 500);
        estadoTabela.elementoCampoPesquisa.addEventListener('keyup', pesquisaDebounced)
    }
    atualizarDadosParaExibicao();
}