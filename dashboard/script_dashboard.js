//função de logout de admin

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

    //atualizar os blocos
    if (document.getElementById('bloco_1')) {
        atualizarBlocos();
    }

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
    
    //barra de pesquisa do header:
    const campoPesquisa = document.getElementById('campoPesquisa')
    const resultadosPesquisa = document.getElementById('resultadosPesquisa')


    campoPesquisa.addEventListener('input', function () {
        const termo = this.value.toLowerCase().trim(); //para nao ter diferença entre maiusculas e minusculas
        state.termoPesquisaAtual = termo
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        resultadosPesquisa.innerHTML = ''

        if (!termo) {
            resultadosPesquisa.style.display = 'none'
            state.querySet = usuarios
            state.paginaAtual = 1
            renderizarTabela()
            return;
        }

        const resultados = usuarios.filter(usuario =>
            usuario.nome && usuario.nome.toLowerCase().includes(termo) // filter percorre a array e mantem resultados cujo nome contem o termo digitado
        );

        if (resultados.length === 0) {
            resultadosPesquisa.style.display = 'none'
            tabela.innerHTML = '<tr><td colspan="4">Nenhum usuário encontrado.</td></tr>';
            paginacaoContainer.innerHTML = ''
            return;
        }

        //cria uma div dinamicamente e coloca o nome do usuario dentro dessa div
        resultados.forEach(usuario => {
            const item = document.createElement('div');
            item.textContent = usuario.nome
            item.style.padding = '8px';
            item.style.cursor = 'pointer'

            item.addEventListener('click', () => {
                //configuração caso clique no resultado da pesquisa
                alert(`${usuario.nome} selecionado`)
                campoPesquisa.value = ''
                resultadosPesquisa.style.display = 'none'

                state.termoPesquisaAtual = ''
                state.querySet = usuarios
                state.paginaAtual = 1
                renderizarTabela()
            });

            resultadosPesquisa.style.display = 'block'

            state.querySet = resultados
            state.paginaAtual = 1
            renderizarTabela(true)
        });


        //Filtra a tabela com os usuarios que combinam com a barra de pesquisa
        const linhas = tabela.getElementsByTagName('tr')
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i]
            const nomeCelula = linha.cells[0]

            if (nomeCelula) {
                const nome = nomeCelula.textContent.toLowerCase()

                if (nome.includes(termo)) {
                    linha.style.display = '';
                } else {
                    linha.style.display = 'none'
                }
            }
        }

    });

    document.addEventListener('click', function (e) {
        if (!campoPesquisa.contains(e.target)) {
            resultadosPesquisa.style.display = 'none'
        }
    });

    //puxar dados do localstorage para a tabela:
    const tabela = document.querySelector('#tabela_usuarios tbody')
    const paginacaoContainer = document.getElementById('paginacao')


    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []

    let state = {
        'querySet': usuarios,
        'paginaAtual': 1,
        'linhasPorPagina': 10,
        'termoPesquisaAtual': '',
    };

    function calcularPaginacao() {
        const startIndex = (state.paginaAtual - 1) * state.linhasPorPagina
        const endIndex = startIndex + state.linhasPorPagina

        //subarray com os usuarios da pagina atual
        const usuariosDaPagina = state.querySet.slice(startIndex, endIndex)

        const totalPaginas = Math.ceil(state.querySet.length / state.linhasPorPagina)

        return {
            'usuariosDaPagina': usuariosDaPagina,
            'totalPaginas': totalPaginas
        };
    }

    function botoesPagina(totalPaginas) {
        paginacaoContainer.innerHTML = ''

        //funcao para controlar o scroll após mudar de pagina
        const scrollTabela = () => {
            tabela.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }

        //botão primeira pagina
        const btn_primeiro = document.createElement('button')
        btn_primeiro.textContent = '<<'
        btn_primeiro.disabled = (state.paginaAtual === 1) //desabilita se tiver na primeira pagina
        btn_primeiro.addEventListener('click', (e) => {
            e.preventDefault() //previne comportamento padrão
            state.paginaAtual = 1
            renderizarTabela()
            scrollTabela()
        });

        //botao anterior
        const btn_anterior = document.createElement('button')
        btn_anterior.textContent = '<'
        btn_anterior.disabled = (state.paginaAtual === 1) //desabilita se nao tiver como voltar
        btn_anterior.addEventListener('click', (e) => {
            e.preventDefault()
            state.paginaAtual--
            renderizarTabela()
            scrollTabela()
        });

        //botao proximo
        const btn_proximo = document.createElement('button')
        btn_proximo.textContent = '>'
        btn_proximo.disabled = (state.paginaAtual === totalPaginas || totalPaginas === 0) //desabilita se estiver na ultima ou nao tiver paginas para avançar
        btn_proximo.addEventListener('click', (e) => {
            e.preventDefault()
            state.paginaAtual++
            renderizarTabela()
            scrollTabela()
        });

        //botao ultima pagina
        const btn_ultima = document.createElement('button')
        btn_ultima.textContent = '>>'
        btn_ultima.disabled = (state.paginaAtual === totalPaginas || totalPaginas === 0) //desabilita se estiver na ultima
        btn_ultima.addEventListener('click', (e) => {
            e.preventDefault
            state.paginaAtual = totalPaginas
            renderizarTabela()
            scrollTabela()
        });

        const info = document.createElement('span')
        info.textContent = `Página ${state.paginaAtual} de ${totalPaginas}`

        //coloca os botões na página
        paginacaoContainer.appendChild(btn_primeiro)
        paginacaoContainer.appendChild(btn_anterior)
        paginacaoContainer.appendChild(info)
        paginacaoContainer.appendChild(btn_proximo)
        paginacaoContainer.appendChild(btn_ultima)

        //classes para estilização:
        paginacaoContainer.querySelectorAll('button').forEach(button => {
            button.classList.add('paginacao-btn')
        });
    }

    function renderizarTabela(mostrarTodos = false) {
        tabela.innerHTML = ''

        let usuariosParaMostrar = []

        if (state.termoPesquisaAtual && mostrarTodos) {
            usuariosParaMostrar = state.querySet
            totalPaginas = 1
        } else {
            const paginacao = calcularPaginacao()
            usuariosParaMostrar = paginacao.usuariosDaPagina
            totalPaginas = paginacao.totalPaginas
        }


        if (usuariosParaMostrar.length > 0) {
            usuariosParaMostrar.forEach(usuario => {
                const tr = document.createElement('tr')
                tr.innerHTML = `
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefone}</td>
                    <td>${usuario.status}</td>
        `;
                tabela.appendChild(tr);
            });
        } else {
            const tr = document.createElement('tr')
            tr.innerHTML = `<td colspan="4">Nenhum usuário encontrado.</td>`;
            tabelaBody.appendChild(tr);
        }

        if (!state.termoPesquisaAtual || !mostrarTodos) {
            botoesPagina(totalPaginas)
        } else {
            paginacaoContainer.innerHTML = `<span>${usuariosParaMostrar.length} resultados encontrados</span>`;
        }
    }

    renderizarTabela();

});