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
    usuariosDaPagina: [],

    paginaAtual: 1,
    linhasPorPagina: 10,
    totalPaginas: 0,

    elementoTabelaBody: null,
    elementoPaginacao: null,
    elementoCampoPesquisa: null,
    sortBy: null,
    sortDirection: 'asc',
    config: {}
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
        const termoBusca = estadoTabela.elementoCampoPesquisa ? estadoTabela.elementoCampoPesquisa.value : '';
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

    const criarBotao = (texto, acao, novaPagina) => {
        const btn = document.createElement('button');
        btn.innerHTML = texto;

        if (!acao) {
            btn.disabled = true;
        } else {
            btn.addEventListener('click', () => {
                estadoTabela.paginaAtual = novaPagina;
                localStorage.setItem('paginaAtualTabela', estadoTabela.paginaAtual);
                atualizarDadosParaExibicao();
            });
        }
        btn.classList.add('paginacao-btn');
        return btn;
    };

    const pag = estadoTabela.paginaAtual;
    const total = estadoTabela.totalPaginas;

    estadoTabela.elementoPaginacao.appendChild(criarBotao('<<', pag > 1, 1))
    estadoTabela.elementoPaginacao.appendChild(criarBotao('<', pag > 1, pag - 1));

    const info = document.createElement('span')
    info.textContent = `Página ${pag} de ${total || 1}`
    estadoTabela.elementoPaginacao.appendChild(info)

    estadoTabela.elementoPaginacao.appendChild(criarBotao('>', pag < total, pag + 1));
    estadoTabela.elementoPaginacao.appendChild(criarBotao('>>', pag < total, total));
}

function atualizarIconesDeOrdenacao() {
    document.querySelectorAll('.ordenar-header').forEach(header => {
        const sortBy = header.dataset.sortBy;
        if (sortBy === estadoTabela.sortBy) {
            header.classList.add('ativo');
            header.classList.toggle('asc', estadoTabela.sortDirection === 'asc');
            header.classList.toggle('desc', estadoTabela.sortDirection === 'desc');
        } else {
            header.classList.remove('ativo', 'asc', 'desc')
        }
    });
}

async function atualizarDadosParaExibicao() {
    if (!estadoTabela.elementoTabelaBody) return;

    const tabela = document.querySelector('.tabela, .tabela_cad-rel');
    if(tabela){
        const carregando = document.createElement('div');
        carregando.className = 'carregando';
        carregando.innerText = 'Carregando...';
        tabela.appendChild(carregando);
    }

    try {

        const parametros = new URLSearchParams({
            numeroPag: estadoTabela.paginaAtual,
            registrosPag: estadoTabela.linhasPorPagina
        });

        const filtro = sessionStorage.getItem('filtroTabela');
        if (filtro && filtro !== 'todos') {
            parametros.append('filtro', filtro);
        }

        const busca = estadoTabela.elementoCampoPesquisa ? estadoTabela.elementoCampoPesquisa.value : '';
        if (busca) {
            parametros.append('busca', busca);
        }

        if (estadoTabela.sortBy) {
            parametros.append('sortBy', estadoTabela.sortBy);
            parametros.append('sortDirection', estadoTabela.sortDirection);
        }

        const resposta = await fetch(`${API_BASE_URL}/api/User?${parametros.toString()}`, {
            headers: getAuthenticationHeaders()
        });

        if (!resposta.ok) {
            throw new Error("Falha ao buscar dados da tabela.");
        }

        const dadosPaginados = await resposta.json();

        estadoTabela.usuariosDaPagina = dadosPaginados.itens || [];
        estadoTabela.totalPaginas = dadosPaginados.totalPag;
        estadoTabela.paginaAtual = dadosPaginados.numeroPag;

        renderizarLinhasTabela();
        renderizarBotoesDePaginacao();
        atualizarIconesDeOrdenacao();

    } catch (error) {
        console.error('Erro ao buscar usuários', error);
        mostrarSnackbar('Não foi possível buscar os dados da tabela.', 'erro');
        estadoTabela.elementoTabelaBody.innerHTML = '<tr><td colspan="5">Erro ao carregar dados.</td></tr>';
    } finally {
        tabela?.querySelector('.carregando')?.remove();
        checarSnackbar();
       
    }
}

function handleSortClick(sortBy) {
    if (estadoTabela.sortBy === sortBy) {
        estadoTabela.sortDirection = estadoTabela.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        estadoTabela.sortBy = sortBy;
        estadoTabela.sortDirection = 'asc';
    }

    estadoTabela.paginaAtual = 1;
    localStorage.setItem('paginaAtualTabela', 1);
    atualizarDadosParaExibicao();
}


function inicializarTabela(config) {

    estadoTabela.config = config
    estadoTabela.elementoTabelaBody = document.querySelector(config.tabelaSelector);
    estadoTabela.elementoPaginacao = document.getElementById(config.paginacaoId);
    estadoTabela.elementoCampoPesquisa = document.getElementById(config.campoPesquisaId);
    estadoTabela.linhasPorPagina = config.linhasPorPagina || 10;
    estadoTabela.paginaAtual = parseInt(localStorage.getItem('paginaAtualTabela')) || 1;

    if (estadoTabela.elementoCampoPesquisa) {
        const acaoPesquisa = () => {
            estadoTabela.paginaAtual = 1;
            localStorage.setItem('paginaAtualTabela', 1);
            atualizarDadosParaExibicao();
        };

        const pesquisaDebounced = debounce(acaoPesquisa, 500);
        estadoTabela.elementoCampoPesquisa.addEventListener('keyup', pesquisaDebounced)
    }

    document.querySelectorAll('.ordenar-header').forEach(header => {
        header.addEventListener('click', () => {
            handleSortClick(header.dataset.sortBy);
        });
    });

    atualizarDadosParaExibicao(config.opcoesIniciais || {});
}