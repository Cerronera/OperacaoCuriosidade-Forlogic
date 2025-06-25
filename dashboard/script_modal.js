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
        document.body.classList.remove('modal-aberto')
    }
}

document.addEventListener('DOMContentLoaded', () => {

    //Seletores Globais
    const modalCadastro = document.getElementById('modal_cadastro')
    const modalEdicao = document.getElementById('modal_edicao')

    //Chamar tabela
    const configTabelaPrincipal = {
        tabelaSelector: '#tabela_usuarios tbody',
        paginacaoId: 'paginacao',
        campoPesquisaId: 'campoPesquisa',
        linhasPorPagina: 10,
        onRowClick: abrirModalEdicao
    };

    inicializarTabela(configTabelaPrincipal)

    // Modal de edição
    function abrirModalEdicao(usuario, index) {

        if (index !== -1) {

            modalEdicao.dataset.index = index
            modalEdicao.classList.remove('oculto')
            document.body.classList.add('modal-aberto')

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

    const validarTelefone = (telefone) => /^\(?([1-9]{2})\)? ?(9?[0-9]{4})-?([0-9]{4})$/.test(telefone)
    //aceita ddd a partir de 1, e aceita telefones fixos (8 numeros) e celulares (9 numeros)

    const validarEmail = (email) => /^[_.]?[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}(?:\.br)?$/i.test(email)
    //aceita . _ numeros no inicio, aceita .br no final


    function erroinputEdit(input, mensagem) {
        const formItem = input.parentElement
        const textoMensagem = formItem.querySelector("a")
        if (textoMensagem) {
            textoMensagem.innerText = mensagem
        }
        formItem.className = 'form_modal erro'
    }

    function sucessoinputEdit(input) {
        const formItem = input.parentElement
        formItem.className = "form_modal"
    }

    function checkEditNome() {
        const nome = document.getElementById('edit_nome');
        if (nome.value.trim() === '') {
            erroinputEdit(nome, "Campo obrigatório");
            return false;
        }
        sucessoinputEdit(nome)
        return true;
    }

    function checkEditIdade() {
        const idadeInput = document.getElementById('edit_idade');
        const idadeValor = idadeInput.value.trim()
        if (idadeValor === '') {
            erroinputEdit(idadeInput, "Campo obrigatório");
            return false
        }

        const idadeNumerica = parseInt(idadeValor, 10)
        if (idadeNumerica < 16) {
            erroinputEdit(idadeInput, "A idade deve ser 16 anos ou mais")
            return false
        } else if (idadeNumerica > 80) {
            erroinputEdit(idadeInput, "A idade deve ser no máximo 80 anos")
            return false;
        } else {
            sucessoinputEdit(idadeInput)
            return true
        }
    }

    function checkEditEmail() {
        const email = document.getElementById('edit_email')
        if (email.value.trim() === '') {
            erroinputEdit(email, "Campo obrigatório")
            return false
        } else if (!validarEmail(email.value)) {
            erroinputEdit(email, "Formato incorreto")
            return false
        }
        sucessoinputEdit(email)
        return true
    }

    function checkEditTelefone() {
        const telefone = document.getElementById('edit_telefone')
        if (telefone.value.trim() === '') {
            erroinputEdit(telefone, "Campo obrigatório")
            return false

        } else if (!validarTelefone(telefone.value)) {
            erroinputEdit(telefone, "Formato incorreto")
            return false
        }
        sucessoinputEdit(telefone)
        return true
    }

    function checkEditEndereco() {
        const endereco = document.getElementById('edit_endereco')
        if (endereco.value.trim() === '') {
            erroinputEdit(endereco, "Campo obrigatório")
            return false
        }
        sucessoinputEdit(endereco)
        return true
    }


    function checkEditOutros() {
        const outros = document.getElementById('edit_outros')
        if (outros.value.trim() === '') {
            erroinputEdit(outros, "Campo obrigatório")
            return false
        }
        sucessoinputEdit(outros)
        return true
    }

    function checkEditInteresses() {
        const interesses = document.getElementById('edit_interesses')
        if (interesses.value.trim() === '') {
            erroinputEdit(interesses, "Campo obrigatório")
            return false
        }
        sucessoinputEdit(interesses)
        return true
    }

    function checkEditSentimentos() {
        const sentimentos = document.getElementById('edit_sentimentos')
        if (sentimentos.value.trim() === '') {
            erroinputEdit(sentimentos, "Campo obrigatório")
            return false
        }
        sucessoinputEdit(sentimentos)
        return true
    }

    function checkEditValores() {
        const valores = document.getElementById('edit_valores')
        if (valores.value.trim() === '') {
            erroinputEdit(valores, "Campo obrigatório")
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
        const emailAtual = document.getElementById('edit_email').value.trim().toLowerCase()
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        const emailJaCadastrado = usuarios.some((user, i) =>
            i !== parseInt(index) && user.email.toLowerCase() === emailAtual
        )

        if (emailJaCadastrado) {
            alert("Este E-mail já está cadastrado para outro usuário")
            erroinputEdit(document.getElementById('edit_email'), "E-mail já pertence a outro usuário")
            return false
        }

        return true
    }

    //Eventos modal de edição:

    // Salvar Edições
    document.getElementById('salvar').addEventListener('click', () => {

        if (checkEditForm()) {
            const index = modalEdicao.dataset.index;
            if (index === undefined) {
                return
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

            alert("Dados atualizados com sucesso!")
            fecharModal(modalEdicao)
            atualizarDadosParaExibicao()
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
        localStorage.setItem('usuarios', JSON.stringify(usuarios))

        alert('Cadastro excluído')
        fecharModal(modalEdicao)
        atualizarDadosParaExibicao()

    });

    document.getElementById('cancelar').addEventListener('click', () => fecharModal(modalEdicao))
    modalEdicao.querySelector('.fechar').addEventListener('click', () => fecharModal(modalEdicao))


    //CADASTRO

    function erroinput(input, mensagem) {
        const formItem = input.parentElement
        const textoMensagem = formItem.querySelector("a")
        textoMensagem.innerText = mensagem
        formItem.className = 'form_cadastro erro'
    }

    function sucessoinput(input) {
        const formItem = input.parentElement
        formItem.className = "form_cadastro"
    }

    function checkNome(nomeInput) {
        if (nomeInput.value.trim() === '') {
            erroinput(nomeInput, "Campo obrigatório")
        } else {
            sucessoinput(nomeInput)
        }
    }

    function checkIdade(idadeInput) {
        const idadeValor = idadeInput.value.trim()
        if (idadeValor === '') {
            erroinput(idadeInput, "Campo obrigatório")
            return
        }
        const idadeNumerica = parseInt(idadeValor, 10)
        if (idadeNumerica < 16) {
            erroinput(idadeInput, "Idade deve ser que 16 anos ou mais")
        } else if (idadeNumerica > 80) {
            erroinput(idadeInput, "Idade deve ser no máximo 80 anos")
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
        const regexTelefone = /^[1-9]{2}(9[0-9]{8}|[2-8][0-9]{7})$/
        if (telefoneValor === '') {
            erroinput(telefoneInput, "Campo obrigatório")
        } else if (!regexTelefone.test(telefoneValor)) {
            erroinput(telefoneInput, "Formato incorreto")
        } else {
            sucessoinput(telefoneInput)
        }
    }

    function checkEndereco(enderecoInput) {
        if (enderecoInput.value === '') {
            erroinput(enderecoInput, "Campo obrigatório")
        } else {
            sucessoinput(enderecoInput)
        }
    }

    function checkOutros(outrosInput) {
        if (outrosInput.value === '') {
            erroinput(outrosInput, "Campo obrigatório")
        } else {
            sucessoinput(outrosInput)
        }
    }

    function checkInteresses(interessesInput) {
        if (interessesInput.value === '') {
            erroinput(interessesInput, "Campo obrigatório")
        } else {
            sucessoinput(interessesInput)
        }
    }

    function checkSentimentos(sentimentosInput) {
        if (sentimentosInput.value === '') {
            erroinput(sentimentosInput, "Campo obrigatório")
        } else {
            sucessoinput(sentimentosInput)
        }
    }

    function checkValores(valoresInput) {
        if (valoresInput.value === '') {
            erroinput(valoresInput, "Campo obrigatório")
        } else {
            sucessoinput(valoresInput)
        }
    }

    function checkForm(formElemento) {
        checkNome(formElemento.querySelector('#idnome'))
        checkIdade(formElemento.querySelector('#ididade'))
        checkEmail(formElemento.querySelector('#idemail'))
        checkTelefone(formElemento.querySelector('#idtelefone'))
        checkEndereco(formElemento.querySelector('#idendereco'))
        checkOutros(formElemento.querySelector('#idoutros'))
        checkInteresses(formElemento.querySelector('#idinteresses'))
        checkSentimentos(formElemento.querySelector('#idsentimentos'))
        checkValores(formElemento.querySelector('#idvalores'))

        const temErros = formElemento.querySelector('.erro') !== null
        if (temErros) {
            return false
        }

        const emailInput = formElemento.querySelector('#idemail')
        const emailValor = emailInput.value.toLowerCase().trim()
        const dadosExistentes = JSON.parse(localStorage.getItem('usuarios')) || [];
        const emailJaCadastrado = dadosExistentes.some(user => user.email.toLowerCase() === emailValor)

        if (emailJaCadastrado) {
            alert("Este e-mail já está cadastrado.")
            erroinput(emailInput, "Este E-mail já existe")
            return false
        }
        //se passou nas validações:
        return true
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
        localStorage.setItem('usuarios', JSON.stringify(dadosExistentes))

        alert("Cadastro salvo com Sucesso!")
        fecharModal(modalCadastro)
        atualizarDadosParaExibicao()
    }

    const btn_cad = document.getElementById('btn_cad')
    if (btn_cad) {
        btn_cad.addEventListener('click', () => {
            modalCadastro.classList.remove('oculto')
            document.body.classList.add('modal-aberto')

            const formCadastro = modalCadastro.querySelector('form')

            //funções de validação:
            formCadastro.querySelector('#idnome').addEventListener("blur", (e) => checkNome(e.target))
            formCadastro.querySelector('#ididade').addEventListener("blur", (e) => checkIdade(e.target))
            formCadastro.querySelector('#idemail').addEventListener("blur", (e) => checkEmail(e.target))
            formCadastro.querySelector('#idtelefone').addEventListener("blur", (e) => checkTelefone(e.target))
            formCadastro.querySelector('#idendereco').addEventListener("blur", (e) => checkEndereco(e.target))
            formCadastro.querySelector('#idoutros').addEventListener("blur", (e) => checkOutros(e.target))
            formCadastro.querySelector('#idinteresses').addEventListener("blur", (e) => checkInteresses(e.target))
            formCadastro.querySelector('#idsentimentos').addEventListener("blur", (e) => checkSentimentos(e.target))
            formCadastro.querySelector('#idvalores').addEventListener("blur", (e) => checkValores(e.target))

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
});

