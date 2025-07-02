function fecharModal(modalElement) {
    if (!modalElement) return;

    document.body.classList.remove('modal-aberto');
    modalElement.classList.add('oculto');

    const form = modalElement.querySelector('form');
    if (!form) return;

    form.reset();

    const camposComErro = form.querySelectorAll('.erro');
    camposComErro.forEach(campo => {
        campo.classList.remove('erro');
    });

    const mensagensDeErro = form.querySelectorAll('.form_cadastro a, .form_modal a');
    mensagensDeErro.forEach(mensagem => {
        mensagem.innerText = '';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const modalCadastro = document.getElementById('modal_cadastro');
    const modalEdicao = document.getElementById('modal_edicao');
    const btnNovoCadastro = document.getElementById('btn_cad');

    function primeiroErro(modalElement) {
        if (!modalElement) return;
        const primeiroErroEncontrado = modalElement.querySelector('.form_cadastro.erro, .form_modal.erro');
        if (primeiroErroEncontrado) {
            primeiroErroEncontrado.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    const validarTelefone = (telefone) => /^\(?([1-9]{2})\)? ?(9?[0-9]{4})-?([0-9]{4})$/.test(telefone);
    const validarEmail = (email) => /^[_.]?[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}(?:\.br)?$/i.test(email);
    const validarIdade = (idade) => {
        const idadeNum = parseInt(idade, 10);
        return !isNaN(idadeNum) && idadeNum >= 16 && idadeNum <= 80;
    };

    function abrirModalCadastro() {
        fecharModal(modalCadastro);
        modalCadastro.classList.remove('oculto');
        document.body.classList.add('modal-aberto');
        modalCadastro.scrollTop = 0;
    }

    function abrirModalEdicao(usuario, index) {
        if (index === -1) return;
        fecharModal(modalEdicao);
        modalEdicao.dataset.index = index;

        const form = modalEdicao.querySelector('form');
        form.querySelector('#edit_nome').value = usuario.nome || '';
        form.querySelector('#edit_idade').value = usuario.idade || '';
        form.querySelector('#edit_email').value = usuario.email || '';
        form.querySelector('#edit_telefone').value = usuario.telefone || '';
        form.querySelector('#edit_endereco').value = usuario.endereco || '';
        form.querySelector('#edit_outros').value = usuario.outros || '';
        form.querySelector('#edit_interesses').value = usuario.interesses || '';
        form.querySelector('#edit_sentimentos').value = usuario.sentimentos || '';
        form.querySelector('#edit_valores').value = usuario.valores || '';
        form.querySelector('#edit_ativo').checked = (usuario.status === "Ativo");

        modalEdicao.classList.remove('oculto');
        document.body.classList.add('modal-aberto');
        modalEdicao.scrollTop = 0;
    }

    function validacaoTempoReal(form, isCadastro) {
        const camposObrigatorios = ['nome', 'idade', 'email', 'telefone', 'endereco'];

        camposObrigatorios.forEach(id => {
            const campo = form.querySelector(isCadastro ? `#id${id}` : `#edit_${id}`);
            if (!campo) return;

            campo.addEventListener('blur', function () {
                const valor = this.value.trim();
                const formItem = this.parentElement;
                const mensagemErro = formItem.querySelector('a');

                if (!valor) {
                    formItem.classList.add('erro');
                    if (mensagemErro) mensagemErro.innerText = 'Campo obrigatório';
                } else {
                    if (id === 'idade' && !validarIdade(valor)) {
                        formItem.classList.add('erro')
                        if (mensagemErro) mensagemErro.innerText = 'Idade deve ser entre 16 e 80 anos'
                    } else if (id === 'email' && !validarEmail(valor)) {
                        formItem.classList.add('erro');
                        if (mensagemErro) mensagemErro.innerText = 'Formato de e-mail inválido';
                    } else if (id === 'telefone' && !validarTelefone(valor)) {
                        formItem.classList.add('erro');
                        if (mensagemErro) mensagemErro.innerText = 'Formato incorreto';
                    } else {
                        formItem.classList.remove('erro');
                        if (mensagemErro) mensagemErro.innerText = '';
                    }
                }
            });
        });
    }

    if (btnNovoCadastro) {
        btnNovoCadastro.addEventListener('click', abrirModalCadastro);
    }

    if (modalCadastro) {
        const formCadastro = modalCadastro.querySelector('form');

        function erroInputCadastro(input, mensagem) {
            const formItem = input.parentElement;
            formItem.className = 'form_cadastro erro';
            const textoMensagem = formItem.querySelector("a");
            if (textoMensagem) textoMensagem.innerText = mensagem;
        }

        function sucessoInputCadastro(input) {
            const formItem = input.parentElement;
            formItem.className = 'form_cadastro';
            const textoMensagem = formItem.querySelector("a");
            if (textoMensagem) textoMensagem.innerText = "";
        }

        function validarFormCadastro() {
            let formValido = true;
            const campos = ['nome', 'idade', 'email', 'telefone', 'endereco'];

            campos.forEach(id => {
                const input = formCadastro.querySelector(`#id${id}`);
                if (input.value.trim() === '') {
                    erroInputCadastro(input, "Campo obrigatório");
                    formValido = false;
                } else {
                    sucessoInputCadastro(input);
                }
            });

            if (!formValido) return false;

            const idadeInput = formCadastro.querySelector('#ididade');
            if (!validarIdade(idadeInput.value)) {
                erroInputCadastro(idadeInput, "Idade deve ser entre 16 e 80 anos");
                return false;
            }

            const emailInput = formCadastro.querySelector('#idemail');
            if (!validarEmail(emailInput.value)) {
                erroInputCadastro(emailInput, "Formato de e-mail inválido");
                return false;
            }

            const telefoneInput = formCadastro.querySelector('#idtelefone');
            if (!validarTelefone(telefoneInput.value)) {
                erroInputCadastro(telefoneInput, "Formato incorreto");
                return false;
            }

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            if (usuarios.some(user => user.email.toLowerCase() === emailInput.value.toLowerCase().trim())) {
                ativarModal('E-mail em Uso', 'Este e-mail já foi cadastrado.', 'erro');
                erroInputCadastro(emailInput, "E-mail já cadastrado");
                return false;
            }

            return true;
        }

        // Configurar validação em tempo real para o formulário de cadastro
        validacaoTempoReal(formCadastro, true);

        formCadastro.addEventListener('submit', (event) => {
            event.preventDefault();
            if (validarFormCadastro()) {
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                const novoUsuario = {
                    nome: padronizarNome(formCadastro.querySelector('#idnome').value.trim()),
                    idade: formCadastro.querySelector('#ididade').value.trim(),
                    email: formCadastro.querySelector('#idemail').value.toLowerCase().trim(),
                    telefone: formCadastro.querySelector('#idtelefone').value.trim(),
                    endereco: formCadastro.querySelector('#idendereco').value.trim(),
                    outros: formCadastro.querySelector('#idoutros').value.trim(),
                    interesses: formCadastro.querySelector('#idinteresses').value.trim(),
                    sentimentos: formCadastro.querySelector('#idsentimentos').value.trim(),
                    valores: formCadastro.querySelector('#idvalores').value.trim(),
                    status: formCadastro.querySelector('#idativo').checked ? "Ativo" : "Inativo",
                    dataCadastro: new Date().toISOString(),
                    revisado: false
                };
                usuarios.push(novoUsuario);
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                ativarModal('Sucesso!', 'Novo usuário cadastrado.', 'aviso');
                fecharModal(modalCadastro);
                atualizarDadosParaExibicao();
            } else {
                primeiroErro(modalCadastro);
            }
        });
    }

    if (modalEdicao) {
        const formEdicao = modalEdicao.querySelector('form');
        const btnSalvar = document.getElementById('salvar');
        const btnCancelar = document.getElementById('cancelar');

        function erroInputEdicao(input, mensagem) {
            const formItem = input.parentElement;
            formItem.className = 'form_modal erro';
            const textoMensagem = formItem.querySelector("a");
            if (textoMensagem) textoMensagem.innerText = mensagem;
        }

        function sucessoInputEdicao(input) {
            const formItem = input.parentElement;
            formItem.className = 'form_modal';
            const textoMensagem = formItem.querySelector("a");
            if (textoMensagem) textoMensagem.innerText = "";
        }

        function validarFormEdicao() {
            let formValido = true;
            const campos = ['nome', 'idade', 'email', 'telefone', 'endereco'];

            campos.forEach(id => {
                const input = formEdicao.querySelector(`#edit_${id}`);
                if (input.value.trim() === '') {
                    erroInputEdicao(input, "Campo obrigatório");
                    formValido = false;
                } else {
                    sucessoInputEdicao(input);
                }
            });

            if (!formValido) return false;

            const idadeInput = formEdicao.querySelector('#edit_idade');
            if (!validarIdade(idadeInput.value)) {
                erroInputEdicao(idadeInput, "Idade deve ser entre 16 e 80 anos");
                return false;
            }

            const emailInput = formEdicao.querySelector('#edit_email');
            if (!validarEmail(emailInput.value)) {
                erroInputEdicao(emailInput, "Formato de e-mail inválido");
                return false;
            }

            const telefoneInput = formEdicao.querySelector('#edit_telefone');
            if (!validarTelefone(telefoneInput.value)) {
                erroInputEdicao(telefoneInput, "Formato incorreto");
                return false;
            }

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const indexAtual = parseInt(modalEdicao.dataset.index, 10);
            if (usuarios.some((user, index) => user.email.toLowerCase() === emailInput.value.toLowerCase().trim() && index !== indexAtual)) {
                ativarModal('E-mail em Uso', 'Este e-mail já pertence a outro usuário.', 'erro');
                erroInputEdicao(emailInput, "E-mail pertence a outro usuário");
                return false;
            }

            return true;
        }

        // Configurar validação em tempo real para o formulário de edição
        validacaoTempoReal(formEdicao, false);

        if (btnSalvar) {
            btnSalvar.addEventListener('click', () => {
                if (validarFormEdicao()) {
                    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                    const index = parseInt(modalEdicao.dataset.index, 10);
                    const usuarioAtualizado = {
                        ...usuarios[index],
                        nome: padronizarNome(formEdicao.querySelector('#edit_nome').value.trim()),
                        idade: formEdicao.querySelector('#edit_idade').value.trim(),
                        email: formEdicao.querySelector('#edit_email').value.toLowerCase().trim(),
                        telefone: formEdicao.querySelector('#edit_telefone').value.trim(),
                        endereco: formEdicao.querySelector('#edit_endereco').value.trim(),
                        outros: formEdicao.querySelector('#edit_outros').value.trim(),
                        interesses: formEdicao.querySelector('#edit_interesses').value.trim(),
                        sentimentos: formEdicao.querySelector('#edit_sentimentos').value.trim(),
                        valores: formEdicao.querySelector('#edit_valores').value.trim(),
                        status: formEdicao.querySelector('#edit_ativo').checked ? "Ativo" : "Inativo",
                        revisado: true
                    };
                    usuarios[index] = usuarioAtualizado;
                    localStorage.setItem('usuarios', JSON.stringify(usuarios));
                    ativarModal('Sucesso!', 'Dados do usuário atualizados.', 'aviso');
                    fecharModal(modalEdicao);
                    atualizarDadosParaExibicao();
                } else {
                    primeiroErro(modalEdicao);
                }
            });
        }
    }

    const btnCancelar = document.getElementById('cancelar');
    if (btnCancelar) btnCancelar.addEventListener('click', () => fecharModal(modalEdicao));
    if (modalEdicao) {
        const btnFecharEdicao = modalEdicao.querySelector('.fechar');
        if (btnFecharEdicao) btnFecharEdicao.addEventListener('click', () => fecharModal(modalEdicao));
    }
    if (modalCadastro) {
        const btnFecharCadastro = modalCadastro.querySelector('.fechar');
        if (btnFecharCadastro) btnFecharCadastro.addEventListener('click', () => fecharModal(modalCadastro));
    }

    async function excluirUsuario(deletarUsuario) {
        try {
            const confirmado = await ativarConfirmacao('Confirmar Exclusão', `Tem certeza que deseja excluir o cadastro de ${deletarUsuario.nome}?`);

            if(!confirmado){
                return;
            }

            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const novosUsuarios = usuarios.filter(user => user.email !== deletarUsuario.email);
            localStorage.setItem('usuarios', JSON.stringify(novosUsuarios));
            atualizarDadosParaExibicao();
        } catch (error) {
            console.error('Erro ao excluir usuário', error)
        }
    }

    const configTabelaPrincipal = {
    tabelaSelector: '#tabela_usuarios tbody',
    paginacaoId: 'paginacao',
    campoPesquisaId: 'campoPesquisa',
    linhasPorPagina: 10,
    onRowClick: abrirModalEdicao,
    mostrarColunaAcoes: true,
    onDeleteClick: excluirUsuario,
    manterAlturaTabela: true
};
inicializarTabela(configTabelaPrincipal);
});