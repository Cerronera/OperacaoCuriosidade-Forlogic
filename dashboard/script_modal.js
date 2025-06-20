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

// Função para fechar qualquer modal
function fecharModal(modalElement) {
    if (modalElement) {
        modalElement.classList.add('oculto')

        const form = modalElement.querySelector('form')
        if (form) {
            form.reset()
            form.querySelectorAll('a').forEach(campoComErro => {
                campoComErro.classList.remove('erro')
            });
            form.querySelectorAll('a').forEach(textoErro => {
                if (textoErro.parentElement.classList.contains('form_cadastro') || textoErro.parentElement.classList.contains('form_modal')) {
                    textoErro.innerText = ''
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

    //Seletores Globais

    const modalCadastro = document.getElementById('modal_cadastro')
    const modalEdicao = document.getElementById('modal_edicao')
    const campoPesquisa = document.getElementById('campoPesquisa')
    const tabela = document.querySelector('#tabela_usuarios tbody')
    const paginacaoContainer = document.getElementById('paginacao')


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

    // Tabela e paginação:

    let state = {
        'querySet': JSON.parse(localStorage.getItem('usuarios')) || [],
        'paginaAtual': 1,
        'linhasPorPagina': 10,
        'termoPesquisaAtual': '',
    };

    //Tabela e Paginação:

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
        info.textContent = `Página ${state.paginaAtual} de ${totalPaginas || 1}`
        paginacaoContainer.appendChild(info)

        paginacaoContainer.appendChild(btn_proximo)
        paginacaoContainer.appendChild(btn_ultima)

        paginacaoContainer.querySelectorAll('button').forEach(button => {
            button.classList.add('paginacao-btn')
        });
    }

    function renderizarTabela() {
        tabela.innerHTML = '';
        state.querySet = JSON.parse(localStorage.getItem('usuarios')) || []

        const { usuariosDaPagina, totalPaginas, totalUsuarios } = calcularPaginacao()

        if (usuariosDaPagina.length > 0) {
            usuariosDaPagina.forEach((usuario) => {
                const originalIndex = state.querySet.findIndex(u => u.email === usuario.email)
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefone}</td>
                    <td>${usuario.status}</td>
                `;
                // Adiciona evento de clique para abrir o modal
                tr.addEventListener('click', () => abrirModalEdicao(usuario, originalIndex));
                tabela.appendChild(tr);
            });

        } else {
            const tr = document.createElement('tr')
            tr.innerHTML = `<td colspan="4">${state.termoPesquisaAtual ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}</td>`;
            tabela.appendChild(tr);
        }

        botoesPagina(totalPaginas)
    }

    // Modal de edição
    function abrirModalEdicao(usuario, index) {

        if (index !== -1) {

            modalEdicao.dataset.index = index
            modalEdicao.classList.remove('oculto')

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

            document.getElementById('edit_nome').addEventListener("blur", checkEditNome)
            document.getElementById('edit_idade').addEventListener("blur", checkEditIdade)
            document.getElementById('edit_email').addEventListener("blur", checkEditEmail)
            document.getElementById('edit_telefone').addEventListener("blur", checkEditTelefone)
            document.getElementById('edit_endereco').addEventListener("blur", checkEditEndereco)
            document.getElementById('edit_outros').addEventListener("blur", checkEditOutros)
            document.getElementById('edit_interesses').addEventListener("blur", checkEditInteresses)
            document.getElementById('edit_sentimentos').addEventListener("blur", checkEditSentimentos)
            document.getElementById('edit_valores').addEventListener("blur", checkEditValores)
        }
    }

    //Funções  de validação:

    const validarIdade = (idade) => idade >= 16 && idade <= 80
    const validarTelefone = (telefone) => /^\(?([1-9]{2})\)? ?(9?[0-9]{4})-?([0-9]{4})$/.test(telefone)
    //aceita ddd a partir de 1, e aceita telefones fixos (8 numeros) e celulares (9 numeros)

    const validarEmail = (email) => /^[_.]?[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}(?:\.br)?$/i.test(email)
    //aceita . _ numeros no inicio, aceita .br no final


    function erroinputEdit(input, mensagem) {
        const formItem = input.parentElement
        const textoMensagem = formItem.querySelector("a")
        textoMensagem.innerText = mensagem
        formItem.className = 'form_modal erro'
    }

    function sucessoinputEdit(input) {
        const formItem = input.parentElement
        formItem.className = "form_modal"
    }

    function checkEditNome() {
        const nome = document.getElementById('edit_nome');
        if (nome.value === '') {
            erroinput(nome, "Campo obrigatório");
            return false;
        }
        sucessoinputEdit(nome)
        return true;
    }

    function checkEditIdade() {
        const idade = document.getElementById('edit_idade');
        if (idade.value === '') {
            erroinput(idade, "Campo obrigatório");
            return false
        } else if (!validarIdade(idade.value)) {
            erroinput(idade, "Valor não aceito");
            return false
        }
        sucessoinputEdit(idade)
        return true
    }

    function checkEditEmail() {
        const email = document.getElementById('edit_email');
        if (email.value === '') {
            erroinput(email, "Campo obrigatório");
            return false
        } else if (!validarEmail(email.value)) {
            erroinput(email, "Formato incorreto")
            return false
        }
        sucessoinputEdit(email)
        return true
    }

    function checkEditTelefone() {
        const telefone = document.getElementById('edit_telefone');
        if (telefone.value === '') {
            erroinput(telefone, "Campo obrigatório");
            return false

        } else if (!validarTelefone(telefone.value)) {
            erroinput(telefone, "Formato incorreto");
            return false
        }
        sucessoinputEdit(telefone)
        return true
    }

    function checkEditEndereco() {
        const endereco = document.getElementById('edit_endereco');
        if (endereco.value === '') {
            erroinput(endereco, "Campo obrigatório");
            return false
        }
        sucessoinputEdit(endereco)
        return true
    }


    function checkEditOutros() {
        const outros = document.getElementById('edit_outros');
        if (outros.value === '') {
            erroinput(outros, "Campo obrigatório");
            return false
        }
        sucessoinputEdit(outros)
        return true
    }

    function checkEditInteresses() {
        const interesses = document.getElementById('edit_interesses');
        if (interesses.value === '') {
            erroinput(interesses, "Campo obrigatório");
            return false
        }
        sucessoinputEdit(interesses)
        return true
    }

    function checkEditSentimentos() {
        const sentimentos = document.getElementById('edit_sentimentos');
        if (sentimentos.value === '') {
            erroinput(sentimentos, "Campo obrigatório");
            return false
        }
        sucessoinputEdit(sentimentos)
        return true
    }

    function checkEditValores() {
        const valores = document.getElementById('edit_valores');
        if (valores.value === '') {
            erroinput(valores, "Campo obrigatório");
            return false
        }
        sucessoinputEdit(valores)
        return true
    }

    //validação de todo o formulario:
    function checkEditForm() {

        const nomeOk = checkEditNome()
        const idadeOk = checkEditIdade()
        const emailOk = checkEditEmail()
        const telefoneOk = checkEditTelefone()
        const enderecoOk = checkEditEndereco()
        const outrosOk = checkEditOutros()
        const interessesOk = checkEditInteresses()
        const sentimentosOk = checkEditSentimentos()
        const valoresOk = checkEditValores()

        const camposBasicos = nomeOk && idadeOk && emailOk && telefoneOk && enderecoOk && outrosOk && interessesOk && sentimentosOk && valoresOk;

        if (!camposBasicos) {
            return false
        }

        const index = modalEdicao.dataset.index
        const emailAtual = document.getElementById('edit_email').value.trim().toLowerCase();
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const emailJaCadastrado = usuarios.some((user, i) =>
            i !== parseInt(index) && user.email.toLowerCase() === emailAtual
        );

        if (emailJaCadastrado) {
            alert("Este E-mail já está cadastrado para outro usuário");
            erroinputEdit(document.getElementById('edit_email'), "E-mail já pertence a outro usuário");
            return false;
        }

        return true;
    }

    //Eventos modal de edição:

    // Salvar Edições
    document.getElementById('salvar').addEventListener('click', () => {

        if (checkEditForm()) {
            const index = modalEdicao.dataset.index;
            if (index === undefined) {
                return;
            }

            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const checkboxEdit = document.getElementById('edit_ativo')
            const novoStatus = checkboxEdit.checked ? "Ativo" : "Inativo"

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

            alert("Dados atualizados com sucesso!");
            fecharModal(modalEdicao)
            renderizarTabela()
        } else {
            alert("Corrija os campos que contém erro antes de salvar")
        }

    });

    //Excluir dados 
    document.getElementById('excluir').addEventListener('click', () => {
        if (!confirm("Quer excluir esse cadastro?")) {
            return;
        }

        const index = modalEdicao.dataset.index;
        if (index === undefined) {
            return;
        }

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        // Remove o usuário do array
        usuarios.splice(index, 1);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        alert('Cadastro excluído');
        fecharModal(modalEdicao)
        renderizarTabela()

    });

    document.getElementById('cancelar').addEventListener('click', () => fecharModal(modalEdicao))
    modalEdicao.querySelector('.fechar').addEventListener('click', () => fecharModal(modalEdicao))


    function erroinput(input, mensagem) {
        const formItem = input.parentElement;
        const textoMensagem = formItem.querySelector("a");
        textoMensagem.innerText = mensagem;
        formItem.className = 'form_cadastro erro';
    }

    function sucessoinput(input) {
        const formItem = input.parentElement;
        formItem.className = "form_cadastro";
    }

    function checkNome(nomeInput) {
        if (nomeInput.value === '') {
            erroinput(nomeInput, "Campo obrigatório");
        } else {
            sucessoinput(nomeInput)
        }
    }

    function checkIdade(idadeInput) {
        const idadeValor = idadeInput.value
        if (idadeValor.value === '') {
            erroinput(idadeInput, "Campo obrigatório");
        } else if (!(idadeValor >= 16 && idadeValor <= 80)) {
            erroinput(idadeInput, "Valor não aceito");
        } else {
            sucessoinput(idadeInput)
        }
    }

    function checkEmail(emailInput) {
        const emailValor = emailInput.value;
        const regexEmail = /^[_.]?[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}(?:\.br)?$/i
        if (emailValor === '') {
            erroinput(emailInput, "Campo obrigatório");
        } else if (!regexEmail.test(emailValor)) {
            erroinput(emailInput, "Formato incorreto")
        } else {
            sucessoinput(emailInput)
        }
    }

    function checkTelefone(telefoneInput) {
        const telefoneValor = telefoneInput.value;
        const regexTelefone = /^\(?([1-9]{2})\)? ?(9?[0-9]{4})-?([0-9]{4})$/
        if (telefoneInput === '') {
            erroinput(telefoneInput, "Campo obrigatório");
        } else if (!regexTelefone.test(telefoneValor)) {
            erroinput(telefoneInput, "Formato incorreto");
        } else {
            sucessoinput(telefoneInput)
        }
    }

    function checkEndereco(enderecoInput) {
        if (enderecoInput.value === '') {
            erroinput(enderecoInput, "Campo obrigatório");
        } else {
            sucessoinput(enderecoInput)
        }
    }

    function checkOutros(outrosInput) {
        if (outrosInput.value === '') {
            erroinput(outrosInput, "Campo obrigatório");
        } else {
            sucessoinput(outrosInput)
        }
    }

    function checkInteresses(interessesInput) {
        if (interessesInput.value === '') {
            erroinput(interessesInput, "Campo obrigatório");
        } else {
            sucessoinput(interessesInput)
        }
    }

    function checkSentimentos(sentimentosInput) {
        if (sentimentosInput.value === '') {
            erroinput(sentimentosInput, "Campo obrigatório");
        } else {
            sucessoinput(sentimentosInput)
        }
    }

    function checkValores(valoresInput) {
        if (valoresInput.value === '') {
            erroinput(valoresInput, "Campo obrigatório");
        } else {
            sucessoinput(valoresInput)
        }
    }

    function checkForm(formElemento) {
        checkNome(formElemento.querySelector('#idnome'))
        checkIdade(formElemento.querySelector('#ididade'));
        checkEmail(formElemento.querySelector('#idemail'));
        checkTelefone(formElemento.querySelector('#idtelefone'));
        checkEndereco(formElemento.querySelector('#idendereco'));
        checkOutros(formElemento.querySelector('#idoutros'));
        checkInteresses(formElemento.querySelector('#idinteresses'));
        checkSentimentos(formElemento.querySelector('#idsentimentos'));
        checkValores(formElemento.querySelector('#idvalores'));

        const temErros = formElemento.querySelector('.erro') !== null
        if (temErros) {
            return false
        }

        const emailInput = formElemento.querySelector('#idemail')
        const emailValor = emailInput.value.toLowerCase().trim()
        const dadosExistentes = JSON.parse(localStorage.getItem('usuarios')) || [];
        const emailJaCadastrado = dadosExistentes.some(user => user.email.toLowerCase() === emailValor);

        if (emailJaCadastrado) {
            alert("Este e-mail já está cadastrado.");
            erroinput(emailInput, "Este E-mail já existe")
            return false;
        }
        //se passou nas validações:
        return true;
    }

    function submitNovoCadastro(formElemento) {
        const novoUsuario = {
            status: formElemento.querySelector('#cadastro_ativo').checked ? "Ativo" : "Inativo",
            nome: formElemento.querySelector('#idnome').value.trim(),
            idade: formElemento.querySelector('#ididade').value.trim(),
            email: formElemento.querySelector('#idemail').value.toLowerCase().trim(),
            telefone: formElemento.querySelector('#idtelefone').value.trim(),
            endereco: formElemento.querySelector('#idendereco').value.trim(),
            outros: formElemento.querySelector('#idoutros').value.trim(),
            interesses: formElemento.querySelector('#idinteresses').value.trim(),
            sentimentos: formElemento.querySelector('#idsentimentos').value.trim(),
            valores: formElemento.querySelector('#idvalores').value.trim(),
            dataCadastro: new Date().toISOString(),
            revisado: false
        };

        const dadosExistentes = JSON.parse(localStorage.getItem('usuarios')) || [];
        dadosExistentes.push(novoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(dadosExistentes));

        alert("Cadastro salvo com Sucesso!");
        fecharModal(modalCadastro)
        renderizarTabela()
    }

    const btn_cad = document.getElementById('btn_cad')
    if (btn_cad) {
        btn_cad.addEventListener('click', () => {
            modalCadastro.classList.remove('oculto')

            const formCadastro = modalCadastro.querySelector('form')

            //funções de validação:
            formCadastro.querySelector('#idnome').addEventListener("blur", (e) => checkNome(e.target));
            formCadastro.querySelector('#ididade').addEventListener("blur", (e) => checkIdade(e.target));
            formCadastro.querySelector('#idemail').addEventListener("blur", (e) => checkEmail(e.target));
            formCadastro.querySelector('#idtelefone').addEventListener("blur", (e) => checkTelefone(e.target));
            formCadastro.querySelector('#idendereco').addEventListener("blur", (e) => checkEndereco(e.target));
            formCadastro.querySelector('#idoutros').addEventListener("blur", (e) => checkOutros(e.target));
            formCadastro.querySelector('#idinteresses').addEventListener("blur", (e) => checkInteresses(e.target));
            formCadastro.querySelector('#idsentimentos').addEventListener("blur", (e) => checkSentimentos(e.target));
            formCadastro.querySelector('#idvalores').addEventListener("blur", (e) => checkValores(e.target));

            formCadastro.onsubmit = function (event) {
                event.preventDefault()

                if (checkForm(formCadastro)) {
                    submitNovoCadastro(formCadastro)
                } else {
                    alert("Corrija os campos com erro.")
                }
            }
        });
    }
    if (modalCadastro) {
        modalCadastro.querySelector('.fechar').addEventListener('click', () => fecharModal(modalCadastro))
    }

    //Inicialização da página:
    if (campoPesquisa) {
        campoPesquisa.addEventListener('input', function () {
            state.termoPesquisaAtual = this.value.toLowerCase().trim()
            state.paginaAtual = 1
            renderizarTabela()
        });
    }
    renderizarTabela()
});

