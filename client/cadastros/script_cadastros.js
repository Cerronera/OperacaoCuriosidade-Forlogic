function fecharFormModal(modalElement) {
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

    function erroInput(input, mensagem) {
        const formItem = input.parentElement;
        const textoMensagem = formItem.querySelector("a");
        textoMensagem.innerText = mensagem;
        formItem.classList.add('erro');
    }

    function sucessoInput(input) {
        const formItem = input.parentElement;
        formItem.classList.remove('erro');
        const textoMensagem = formItem.querySelector("a");
        if (textoMensagem) {
            textoMensagem.innerText = "";
        }
    }

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

    function checkCampoVazio(form, modo) {
        const prefixo = modo === 'criar' ? 'id' : 'edit';
        const camposObrigatorios = ['nome', 'idade', 'email', 'telefone', 'endereco']

        camposObrigatorios.forEach(id => {
            const campo = form.querySelector(`#${prefixo}${id}`);
            if (campo) {
                campo.addEventListener('blur', () => {
                    if (campo.value.trim() === '') {
                        erroInput(campo, 'Campo obrigatório')
                    } else {
                        sucessoInput(campo)
                    }
                });
            }
        });
    }


    function exibirErros(notificacoes, modo) {
        const prefixo = modo === 'criar' ? 'id' : 'edit';
        notificacoes.forEach(erro => {
            const nomeCampo = erro.message.replace('Usuario', '').toLowerCase();
            const inputParaMarcar = document.getElementById(`${prefixo}${nomeCampo}`);

            if (inputParaMarcar) {
                erroInput(inputParaMarcar, erro.descricao);
            }
        });
    }
    const campoIdade = document.getElementById('ididade');
    const editIdade = document.getElementById('edit_idade')

    const bloquearCaracteres = (event) => {
        const teclasBloqueadas = ['e', 'E', '+', '-', '.', ','];

        if(teclasBloqueadas.includes(event.key)){
            event.preventDefault();
        }
    }
    if(campoIdade) campoIdade.addEventListener('keydown', bloquearCaracteres);
    if(editIdade) editIdade.addEventListener('keydown', bloquearCaracteres) 

    function abrirModalCadastro() {
        const form = modalCadastro.querySelector('form')
        fecharFormModal(modalCadastro);
        modalCadastro.classList.remove('oculto');
        document.body.classList.add('modal-aberto');
        modalCadastro.scrollTop = 0;
        checkCampoVazio(form, 'criar');
    }

    function abrirModalEdicao(usuario, index) {
        if (index === -1) return;
        fecharFormModal(modalEdicao);
        modalEdicao.dataset.userId = usuario.id;

        const form = modalEdicao.querySelector('form');
        form.querySelector('#edit_nome').value = usuario.nomeUsuario || '';
        form.querySelector('#edit_idade').value = usuario.idadeUsuario || '';
        form.querySelector('#edit_email').value = usuario.emailUsuario || '';
        form.querySelector('#edit_telefone').value = usuario.telefoneUsuario || '';
        form.querySelector('#edit_endereco').value = usuario.enderecoUsuario || '';
        form.querySelector('#edit_outros').value = usuario.outrasInformacoesUsuario || '';
        form.querySelector('#edit_interesses').value = usuario.interessesUsuario || '';
        form.querySelector('#edit_sentimentos').value = usuario.sentimentosUsuario || '';
        form.querySelector('#edit_valores').value = usuario.valoresUsuario || '';
        form.querySelector('#edit_ativo').checked = (usuario.statusUsuario);

        modalEdicao.classList.remove('oculto');
        document.body.classList.add('modal-aberto');
        modalEdicao.scrollTop = 0;
        checkCampoVazio(form, 'editar')
    }

    if (btnNovoCadastro) {
        btnNovoCadastro.addEventListener('click', abrirModalCadastro);
    }

    if (modalCadastro) {
        const formCadastro = modalCadastro.querySelector('form')

        function coletarDadosDeCadastro() {
            return {
                nomeUsuario: padronizarNome(formCadastro.querySelector('#idnome').value.trim()),
                idadeUsuario: parseInt(formCadastro.querySelector('#ididade').value, 10),
                emailUsuario: formCadastro.querySelector('#idemail').value.toLowerCase().trim(),
                telefoneUsuario: formCadastro.querySelector('#idtelefone').value.trim(),
                enderecoUsuario: formCadastro.querySelector('#idendereco').value.trim(),
                outrasInformacoesUsuario: formCadastro.querySelector('#idoutros').value.trim(),
                interessesUsuario: formCadastro.querySelector('#idinteresses').value.trim(),
                sentimentosUsuario: formCadastro.querySelector('#idsentimentos').value.trim(),
                valoresUsuario: formCadastro.querySelector('#idvalores').value.trim(),
                statusUsuario: formCadastro.querySelector('#idativo').checked
            };
        }

        async function handleCadastroSubmit(event) {
            event.preventDefault();
            event.stopPropagation();

            const userDto = coletarDadosDeCadastro();

            try {
                const resposta = await fetch(`${API_BASE_URL}/api/User`, {
                    method: 'POST',
                    headers: getAuthenticationHeaders(),
                    body: JSON.stringify(userDto)
                });

                if (resposta.ok) {
                    const snackbarData = {
                        mensagem: `${userDto.nomeUsuario} foi cadastrado(a) com sucesso`,
                        tipo: 'sucesso'
                    };
                    sessionStorage.setItem('snackbarData', JSON.stringify(snackbarData));
                    fecharFormModal(modalCadastro);
                } else {
                    const erros = await resposta.json();
                    if (resposta.status == 400) {
                        exibirErros(erros, 'criar');
                        primeiroErro(modalCadastro);
                    } else if (resposta.status == 409) {
                        erroInput(formCadastro.querySelector('#idemail'), erros[0].descricao);
                    } else {
                        console.error("Erro inesperado");
                    }
                }
            } catch (error) {
                console.error("Erro de rede ao criar usuário", error);
            }
        }
        formCadastro.addEventListener('submit', handleCadastroSubmit);
        atualizarDadosParaExibicao({ irParaUltimaPagina: true });
    }

    if (modalEdicao) {
        const btnSalvar = document.getElementById('salvar');
        const formEdicao = modalEdicao.querySelector('form');

        function coletarDadosDeEdicao() {
            return {
                nomeUsuario: padronizarNome(formEdicao.querySelector('#edit_nome').value.trim()),
                idadeUsuario: parseInt(formEdicao.querySelector('#edit_idade').value, 10),
                emailUsuario: formEdicao.querySelector('#edit_email').value.toLowerCase().trim(),
                telefoneUsuario: formEdicao.querySelector('#edit_telefone').value.trim(),
                enderecoUsuario: formEdicao.querySelector('#edit_endereco').value.trim(),
                outrasInformacoesUsuario: formEdicao.querySelector('#edit_outros').value.trim(),
                interessesUsuario: formEdicao.querySelector('#edit_interesses').value.trim(),
                sentimentosUsuario: formEdicao.querySelector('#edit_sentimentos').value.trim(),
                valoresUsuario: formEdicao.querySelector('#edit_valores').value.trim(),
                statusUsuario: formEdicao.querySelector('#edit_ativo').checked,
            };
        }

        async function handleAtualizarSubmit() {
            const userId = modalEdicao.dataset.userId;
            if (!userId) {
                console.error("ID do usuário não encontrado para edição");
                return;
            }
            const userDto = coletarDadosDeEdicao();

            try {
                const resposta = await fetch(`${API_BASE_URL}/api/User/${userId}`, {
                    method: 'PUT',
                    headers: getAuthenticationHeaders(),
                    body: JSON.stringify(userDto)
                });

                if (resposta.ok) {
                    const snackbarData = {
                        mensagem: `${userDto.nomeUsuario} foi atualizado(a) com sucesso`,
                        tipo: 'sucesso'
                    };
                    sessionStorage.setItem('snackbarData', JSON.stringify(snackbarData));
                    fecharFormModal(modalEdicao);
                    setTimeout(() => {
                        atualizarDadosParaExibicao();
                    }, 500);

                } else {
                    const erros = await resposta.json();
                    if (resposta.status == 400) {
                        exibirErros(erros, 'editar')
                        primeiroErro(modalEdicao);
                    } else {
                        console.error("Erro inesperado");
                    }
                }
            } catch (error) {
                console.error("Erro de rede ao atualizar usuário", error)
            }
        }
        if (btnSalvar) {
            btnSalvar.addEventListener('click', handleAtualizarSubmit);
        }
    }

    const btnCancelar = document.getElementById('cancelar');
    if (btnCancelar) btnCancelar.addEventListener('click', () => fecharFormModal(modalEdicao));

    if (modalEdicao) {
        const btnFecharEdicao = modalEdicao.querySelector('.fechar');
        if (btnFecharEdicao) btnFecharEdicao.addEventListener('click', () => fecharFormModal(modalEdicao));
    }
    if (modalCadastro) {
        const btnFecharCadastro = modalCadastro.querySelector('.fechar');
        if (btnFecharCadastro) btnFecharCadastro.addEventListener('click', () => fecharFormModal(modalCadastro));
    }

    async function excluirUsuario(deletarUsuario) {
        try {
            const confirmado = await ativarConfirmacao('Confirmar Exclusão', `Tem certeza que deseja excluir o cadastro de ${deletarUsuario.nomeUsuario}?`)

            if (confirmado) {
                const resposta = await fetch(`${API_BASE_URL}/api/User/${deletarUsuario.id}`, {
                    method: 'DELETE',
                    headers: getAuthenticationHeaders()
                });

                if (resposta.ok) {
                    const snackbarData = {
                        mensagem: `${deletarUsuario.nomeUsuario} foi excluído(a) com sucesso`,
                        tipo: 'erro'
                    };
                    sessionStorage.setItem('snackbarData', JSON.stringify(snackbarData));

                    setTimeout(() => {
                        atualizarDadosParaExibicao();
                    }, 500);
                } else {
                    mostrarSnackbar('Erro ao excluir. Tente novamente.', 'erro');
                    console.error("Não foi possível excluir o usuário na API");
                }
            } else {
                console.log("Exclusão cancelada")
            }
        } catch (error) {
            console.log("Exclusão cancelada pelo usuário.");
        }
    }

    const adminInfoString = sessionStorage.getItem('adminInfo')
    if (!adminInfoString) return;

    const adminInfo = JSON.parse(adminInfoString);
    const isAdmin = (adminInfo.role === 'Administrator');

    const colunaExcluir = document.getElementById('coluna_delete');
    if (colunaExcluir) {
        colunaExcluir.style.display = isAdmin ? 'table-cell' : 'none';
    }
    const configTabelaPrincipal = {
        tabelaSelector: '#tabela_usuarios tbody',
        paginacaoId: 'paginacao',
        campoPesquisaId: 'campoPesquisa',
        linhasPorPagina: 10,
        onRowClick: abrirModalEdicao,
        mostrarColunaAcoes: isAdmin,
        onDeleteClick: isAdmin ? excluirUsuario : null,
        manterAlturaTabela: true
    };

    inicializarTabela(configTabelaPrincipal);
});