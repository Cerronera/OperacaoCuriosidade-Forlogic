// Funções de navegação
function voltar_login() {
    setTimeout(() => {
        window.location.href = '/login_cadastro/login.html'
    }, 200);
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

// Função para fechar modal
function fecharModal() {
    document.getElementById('modal_edicao').classList.add('oculto')
}


// Carregar dados na tabela e configurar edição
document.addEventListener('DOMContentLoaded', () => {

    //barra de pesquisa do header:
    const campoPesquisa = document.getElementById('campoPesquisa')
    const resultadosPesquisa = document.getElementById('resultadosPesquisa')
    const tabela = document.querySelector('#tabela_usuarios tbody')
    const paginacaoContainer = document.getElementById('paginacao')

    resultadosPesquisa.style.display = 'none'

    let state = {
        'querySet': JSON.parse(localStorage.getItem('usuarios')) || [],
        'paginaAtual': 1,
        'linhasPorPagina': 10,
        'termoPesquisaAtual': '',
    };

    function calcularPaginacao() {
        const startIndex = (state.paginaAtual - 1) * state.linhasPorPagina
        const endIndex = startIndex + state.linhasPorPagina

        //filtra primeiro por pesquisa e depois aplica paginação
        let usuariosFiltrados = state.querySet
        if (state.termoPesquisaAtual) {
            usuariosFiltrados = usuariosFiltrados.filter(usuario =>
                usuario.nome && usuario.nome.toLowerCase().includes(state.termoPesquisaAtual)
            );
        }

        const usuariosDaPagina = usuariosFiltrados.slice(startIndex, endIndex)
        const totalPaginas = Math.ceil(state.querySet.length / state.linhasPorPagina)

        return {
            'usuariosDaPagina': usuariosDaPagina,
            'totalPaginas': totalPaginas,
            'totalUsuarios': usuariosFiltrados.length
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

        paginacaoContainer.appendChild(btn_primeiro)

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

        paginacaoContainer.appendChild(btn_primeiro)
        paginacaoContainer.appendChild(btn_anterior)


        const info = document.createElement('span')
        info.textContent = `Página ${state.paginaAtual} de ${totalPaginas}`
        paginacaoContainer.appendChild(info)

        paginacaoContainer.appendChild(btn_proximo)
        paginacaoContainer.appendChild(btn_ultima)

        //estilização botoes:
        paginacaoContainer.querySelectorAll('button').forEach(button => {
            button.classList.add('paginacao-btn')
        });
    }

    function renderizarTabela() {
        tabela.innerHTML = '';

        const { usuariosDaPagina, totalPaginas, totalUsuarios } = calcularPaginacao()

        if (usuariosDaPagina.length > 0) {
            usuariosDaPagina.forEach((usuario) => {
                const tr = document.createElement('tr');
                tr.dataset.index = usuario.index; // Mantemos a referência ao índice original
                tr.innerHTML = `
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefone}</td>
                    <td>${usuario.status}</td>
                `;
                // Adiciona evento de clique para abrir o modal
                tr.addEventListener('click', () => abrirModalEdicao(usuario));

                tabela.appendChild(tr);
            });
        } else {
            const tr = document.createElement('tr')
            tr.innerHTML = `<td colspan="4">${state.termoPesquisaAtual ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}</td>`;
            tabela.appendChild(tr);
        }

        botoesPagina(totalPaginas)
    }
    // Evento para abrir modal de edição
    function abrirModalEdicao(usuario) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []
        const index = usuarios.findIndex(u => u.nome === usuario.nome && u.email === usuario.email)

        if (index !== -1) {
            const modal = document.getElementById('modal_edicao')
            modal.dataset.index = index
            modal.classList.remove('oculto')

            document.getElementById('edit_nome').value = usuario.nome
            document.getElementById('edit_idade').value = usuario.idade || ''
            document.getElementById('edit_email').value = usuario.email || ''
            document.getElementById('edit_telefone').value = usuario.telefone || ''
            document.getElementById('edit_endereco').value = usuario.endereco || ''
            document.getElementById('edit_outros').value = usuario.outros || ''
            document.getElementById('edit_interesses').value = usuario.interesses || ''
            document.getElementById('edit_sentimentos').value = usuario.sentimentos || ''
            document.getElementById('edit_valores').value = usuario.valores || ''
            document.getElementById('edit_ativo').checked = (usuario.status === "Ativo")
            document.getElementById('modal_edicao').scrollTop = 0;
        }
    }

    campoPesquisa.addEventListener('input', function () {
        const termo = this.value.toLowerCase().trim()
        state.termoPesquisaAtual = termo
        state.paginaAtual = 1
        renderizarTabela()
    });

    renderizarTabela()

    // Cancelar Edição
    const botaoCancelar = document.getElementById('cancelar')
    const modal = document.getElementById('modal_edicao')
    if (botaoCancelar) {
        botaoCancelar.addEventListener('click', () => {
            modal.classList.add('oculto')
        })
    }

    //validação de todo o formulario:
    function checkEditForm() {
        const valido =
            checkEditNome() &&
            checkEditIdade() &&
            checkEditEmail() &&
            checkEditTelefone() &&
            checkEditEndereco() &&
            checkEditOutros() &&
            checkEditInteresses() &&
            checkEditSentimentos() &&
            checkEditValores();

        const botaoSalvar = document.getElementById('salvar')

        if (valido) {

            //verifica se o email já existe, com exceção do usuario que esta sendo editado
            const modal = document.getElementById('modal_edicao')
            const index = modal.dataset.index
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const emailAtual = document.getElementById('edit_email').value.trim().toLowerCase()

            const emailJaCadastrado = usuarios.some((user, i) =>
                i !== parseInt(index) && user.email.toLowerCase() === emailAtual
            );

            if (emailJaCadastrado) {
                alert("Este E-mail já está cadastrado para outro usuário")
                botaoSalvar.classList.add('erro');
                botaoSalvar.classList.remove('sucesso');
                return false;
            }

            botaoSalvar.classList.add('sucesso');
            botaoSalvar.classList.remove('erro');
            return true;

        } else {
            alert("Preencha os campos corretamente");
            botaoSalvar.classList.add('erro');
            botaoSalvar.classList.remove('sucesso');
            return false;
        }
    }

    // Salvar Edições
    const botaoSalvar = document.getElementById('salvar')
    if (botaoSalvar) {
        botaoSalvar.addEventListener('click', () => {

            if (!checkEditForm()) {
                return;
            }

            const modal = document.getElementById('modal_edicao');
            const index = modal.dataset.index;
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const checkboxEdit = document.getElementById('edit_ativo')
            const novoStatus = checkboxEdit.checked ? "Ativo" : "Inativo"

            if (index < 0 || index >= usuarios.length) {
                alert("Erro: índice de usuário inválido")
                return;
            }

            const usuarioAtualizado = {
                ...usuarios[index],
                nome: document.getElementById('edit_nome').value.trim(),
                idade: document.getElementById('edit_idade').value.trim(),
                email: document.getElementById('edit_email').value.trim(),
                telefone: document.getElementById('edit_telefone').value.trim(),
                endereco: document.getElementById('edit_endereco').value.trim(),
                outros: document.getElementById('edit_outros').value.trim(),
                interesses: document.getElementById('edit_interesses').value.trim(),
                sentimentos: document.getElementById('edit_sentimentos').value.trim(),
                valores: document.getElementById('edit_valores').value.trim(),
                status: novoStatus,   
                revisado: true //ao salvar coloca como true
            };

            usuarios[index] = usuarioAtualizado
            //atualizar lista de usuarios
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            modal.classList.add('oculto')
            location.reload();

            renderizarTabela()

            if (document.getElementById('bloco_1')) {
                atualizarBlocos();
            }

            alert("Dados atualizados com sucesso!");
        });
    }


    //Excluir dados do localstorage

    const botaoExcluir = document.getElementById('excluir')
    if (botaoExcluir) {
        botaoExcluir.addEventListener('click', () => {
            if (!confirm("Quer excluir esse cadastro?")) {
                return;
            }

            const modal = document.getElementById('modal_edicao');
            const index = modal.dataset.index;
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            // Remove o usuário do array
            usuarios.splice(index, 1);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            modal.classList.add('oculto');

            //atualiza o bloco
            if (document.getElementById('bloco_1')) {
                atualizarBlocos();
            }

            alert('Cadastro excluído');
            location.reload();
        });
    }
});
//Funções  de validação:
//Confirmar se os campos estao preenchidos corretamente:
function erroinput(input, mensagem) {
    const formItem = input.parentElement;
    const textoMensagem = formItem.querySelector("a");
    textoMensagem.innerText = mensagem;
    formItem.className = 'form erro';
}

function validarIdade(idade) {
    if (idade < 16 || idade > 80) {
        return false;
    }
    return true;
}

function validarTelefone(telefone) {
    const regexTelefone = /^\(?([1-9]{2})\)? ?(9?[0-9]{4})-?([0-9]{4})$/
    //aceita ddd a partir de 1, e aceita telefones fixos (8 numeros) e celulares (9 numeros)
    return regexTelefone.test(telefone)
}

function validarEmail(email) {
    const regexEmail = /^[_.]?[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}(?:\.br)?$/i; //aceita . _ numeros no inicio, aceita .br no final

    return regexEmail.test(email)
}

//função para validar email com regex


function checkEditNome() {
    const nome = document.getElementById('edit_nome');
    const nomeValor = nome.value;
    if (nomeValor === '') {
        erroinput(nome, "Campo obrigatório");
        return false;
    }
    const formItem = nome.parentElement;
    formItem.className = "form_modal";
    return true;
}

function checkEditIdade() {
    const idade = document.getElementById('edit_idade');
    const idadeValor = idade.value;
    if (idadeValor === '') {
        erroinput(idade, "Campo obrigatório");
        return false;
    } else if (!validarIdade(idadeValor)) {
        erroinput(idade, "Valor não aceito");
        return false;
    }
    const formItem = idade.parentElement;
    formItem.className = "form_modal";
    return true;
}

function checkEditEmail() {
    const email = document.getElementById('edit_email');
    const emailValor = email.value;
    if (emailValor === '') {
        erroinput(email, "Campo obrigatório");
        return false;
    } else if (!validarEmail(emailValor)) {
        erroinput(email, "Formato incorreto")
        return false;
    }
    else {
        const formItem = email.parentElement;
        formItem.className = "form_modal";
        return true;
    }
}

function checkEditTelefone() {
    const telefone = document.getElementById('edit_telefone');
    const telefoneValor = telefone.value;
    if (telefoneValor === '') {
        erroinput(telefone, "Campo obrigatório");
        return false;
    } else if (!validarTelefone(telefoneValor)) {
        erroinput(telefone, "Formato incorreto");
        return false;
    }
    const formItem = telefone.parentElement;
    formItem.className = "form_modal";
    return true;
}

function checkEditEndereco() {
    const endereco = document.getElementById('edit_endereco');
    const enderecoValor = endereco.value;
    if (enderecoValor === '') {
        erroinput(endereco, "Campo obrigatório");
        return false;
    }
    const formItem = endereco.parentElement;
    formItem.className = "form_modal";
    return true;
}

function checkEditOutros() {
    const outros = document.getElementById('edit_outros');
    const outrosValor = outros.value;
    if (outrosValor === '') {
        erroinput(outros, "Campo obrigatório");
        return false;
    }
    const formItem = outros.parentElement;
    formItem.className = "form_modal";
    return true;
}

function checkEditInteresses() {
    const interesses = document.getElementById('edit_interesses');
    const interessesValor = interesses.value;
    if (interessesValor === '') {
        erroinput(interesses, "Campo obrigatório");
        return false;
    }
    const formItem = interesses.parentElement;
    formItem.className = "form_modal";
    return true;
}

function checkEditSentimentos() {
    const sentimentos = document.getElementById('edit_sentimentos');
    const sentimentosValor = sentimentos.value;
    if (sentimentosValor === '') {
        erroinput(sentimentos, "Campo obrigatório");
        return false;
    }
    const formItem = sentimentos.parentElement;
    formItem.className = "form_modal";
    return true;
}

function checkEditValores() {
    const valores = document.getElementById('edit_valores');
    const valoresValor = valores.value;
    if (valoresValor === '') {
        erroinput(valores, "Campo obrigatório");
        return false;
    }
    const formItem = valores.parentElement;
    formItem.className = "form_modal";
    return true;
}
