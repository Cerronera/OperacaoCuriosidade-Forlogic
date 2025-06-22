
function voltar_login() {

    const confirmar = confirm("Você tem certeza que deseja sair?")

    if(confirmar){
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

function abrirNovoCadastro() {
    window.location.href = '/dashboard/novocadastro.html'
}

document.addEventListener('DOMContentLoaded', () => {

    const campoPesquisa = document.getElementById('campoPesquisa')
    const resultadosPesquisa = document.getElementById('resultadosPesquisa')
    const tabela = document.querySelector('#tabela_usuarios tbody')
    const paginacaoContainer = document.getElementById('paginacao')
    const btn_imp = document.getElementById('btn_imp')

     // carregar informações do admin
    function carregarAdmin(){
        const emailLogado = sessionStorage.getItem('adminLogado')

        //função pra bloquear acesso se nao tiver logado
        if(!emailLogado){
            alert("Nenhum administrador logado. Por favor, faça o Login.")
            window.location.href = '../login_cadastro/login.html'
            return;
        }

        const admins = JSON.parse(localStorage.getItem('admins')) || [];

        const adminInfo = admins.find(admin => admin.email === emailLogado)

        if(adminInfo){
            const nomeUsuario = document.querySelector('.usuario_nome')
            if(nomeUsuario){
                nomeUsuario.textContent = adminInfo.nome
            }
        } else {
            alert("Erro ao carregar informações do Administrador.")
            window.location.href = '../login_cadastro/login.html'
        }
    }
    carregarAdmin()

    resultadosPesquisa.style.display = 'none'

    let state = {
        'querySet': JSON.parse(localStorage.getItem('usuarios')) || [],
        'paginaAtual': 1,
        'linhasPorPagina': 20,
        'termoPesquisaAtual': '',
    };

    function calcularPaginacao() {
        const startIndex = (state.paginaAtual - 1) * state.linhasPorPagina;
        const endIndex = startIndex + state.linhasPorPagina;

        let usuariosFiltrados = state.querySet;
        if (state.termoPesquisaAtual) {
            usuariosFiltrados = usuariosFiltrados.filter(usuario =>
                usuario.nome && usuario.nome.toLowerCase().includes(state.termoPesquisaAtual)
            );
        }

        const usuariosDaPagina = usuariosFiltrados.slice(startIndex, endIndex);
        const totalPaginas = Math.ceil(usuariosFiltrados.length / state.linhasPorPagina);

        return {
            'usuariosDaPagina': usuariosDaPagina,
            'totalPaginas': totalPaginas,
            'totalUsuarios': usuariosFiltrados.length
        };
    }

    function botoesPagina(totalPaginas) {
        paginacaoContainer.innerHTML = ''

        const btn_primeiro = document.createElement('button')
        btn_primeiro.textContent = '<<'
        btn_primeiro.disabled = (state.paginaAtual === 1)
        btn_primeiro.addEventListener('click', () => {
            state.paginaAtual = 1
            renderizarTabela()
        });

        const btn_anterior = document.createElement('button')
        btn_anterior.textContent = '<'
        btn_anterior.disabled = (state.paginaAtual === 1)
        btn_anterior.addEventListener('click', () => {
            state.paginaAtual--
            renderizarTabela()
        });

        const btn_proximo = document.createElement('button')
        btn_proximo.textContent = '>'
        btn_proximo.disabled = (state.paginaAtual === totalPaginas || totalPaginas === 0)
        btn_proximo.addEventListener('click', () => {
            state.paginaAtual++
            renderizarTabela()

        });

        const btn_ultima = document.createElement('button')
        btn_ultima.textContent = '>>'
        btn_ultima.disabled = (state.paginaAtual === totalPaginas || totalPaginas === 0);
        btn_ultima.addEventListener('click', () => {
            state.paginaAtual = totalPaginas
            renderizarTabela()
        });

        const info = document.createElement('span')
        info.textContent = `Página ${state.paginaAtual} de ${totalPaginas} -- ${state.querySet.length} registros`

        paginacaoContainer.appendChild(btn_primeiro)
        paginacaoContainer.appendChild(btn_anterior)
        paginacaoContainer.appendChild(info)
        paginacaoContainer.appendChild(btn_proximo)
        paginacaoContainer.appendChild(btn_ultima)

        paginacaoContainer.querySelectorAll('button').forEach(button => {
            button.classList.add('paginacao-btn')
        });
    }

    function renderizarTabela() {
        tabela.innerHTML = '';
        const { usuariosDaPagina, totalPaginas } = calcularPaginacao();

        if (usuariosDaPagina.length > 0) {
            usuariosDaPagina.forEach((usuario, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefone}</td>
                    <td>${usuario.status}</td>
                `;
                tabela.appendChild(tr);
            });
        } else {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="4">${state.termoPesquisaAtual ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}</td>`;
            tabela.appendChild(tr);
        }

        botoesPagina(totalPaginas);
    }
    // Barra de pesquisa
    campoPesquisa.addEventListener('input', function () {
        const termo = this.value.toLowerCase().trim();
        state.termoPesquisaAtual = termo;
        state.paginaAtual = 1; // Reset para primeira página ao pesquisar
        renderizarTabela();
    });

    if (btn_imp) {
        btn_imp.addEventListener('click', () => {
            // Salva o estado atual
            const linhasPorPaginaOriginal = state.linhasPorPagina;
            const paginaAtualOriginal = state.paginaAtual;

            // Mostra todos os registros na hora de imprimir
            state.linhasPorPagina = state.querySet.length;
            state.paginaAtual = 1;
            renderizarTabela();

            const agora = new Date();
            document.documentElement.setAttribute('data-print-date', agora.toLocaleDateString());
            document.documentElement.setAttribute('data-print-datetime', agora.toLocaleString());

            // Espera um pouco para renderizar antes de imprimir
            setTimeout(() => {
                window.print();

                // Restaura o estado original
                state.linhasPorPagina = linhasPorPaginaOriginal;
                state.paginaAtual = paginaAtualOriginal;
                renderizarTabela();

                // Remove os atributos 
                document.documentElement.removeAttribute('data-print-date');
                document.documentElement.removeAttribute('data-print-datetime');
            }, 100);
        });
    }

    // Inicialização
    renderizarTabela();
});







