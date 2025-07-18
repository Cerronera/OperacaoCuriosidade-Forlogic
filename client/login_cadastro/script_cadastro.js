document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form_dados');
    const nomeInput = document.getElementById('inome');
    const emailInput = document.getElementById('iemail');
    const funcao = document.getElementById('ifuncao');
    const senhaInput = document.getElementById('isenha');
    const confirmarSenhaInput = document.getElementById('iconfirmarsenha');

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

    function limparErros() {
        form.querySelectorAll('.erro').forEach(campoComErro => {
            campoComErro.classList.remove('erro')
        });
        form.querySelectorAll('a').forEach(textoComErro => {
            textoComErro.innerHTML = ""
        });
    }

    function checkCampoVazio(input, mensagem) {
        if (input.value.trim() === '') {
            erroInput(input, mensagem)
        } else {
            sucessoInput(input)
        }
    }

    nomeInput.addEventListener("blur", () => checkCampoVazio(nomeInput, "Campo Obrigatório"));
    emailInput.addEventListener("blur", () => checkCampoVazio(emailInput, "Campo Obrigatório"));
    senhaInput.addEventListener("blur", () => checkCampoVazio(senhaInput, "Campo Obrigatório"));
    confirmarSenhaInput.addEventListener("blur", () => checkCampoVazio(confirmarSenhaInput, "Campo Obrigatório"));

    function exibirErros(notificacoes) {
       notificacoes.forEach(erro => {
            let marcador = null

            switch (erro.message) {
                case 'nomeAdmin':
                    marcador = nomeInput;
                    break;
                case 'emailAdmin':
                    marcador = emailInput;
                    break;
                case 'senhaAdmin':
                    marcador = senhaInput;
                    break;
            }

            if (marcador) {
                erroInput(marcador, erro.descricao)
            }
        });
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        limparErros();

        const camposPreenchidos =
            nomeInput.value.trim() !== '' &&
            emailInput.value.trim() !== '' &&
            senhaInput.value !== '' &&
            confirmarSenhaInput.value !== '';

        if (!camposPreenchidos) {
            ativarModal('Campos não preenchidos', 'Preencha todos os campos obrigatórios', 'erro')
            return;
        }

        if (senhaInput.value !== confirmarSenhaInput.value) {
            erroInput(confirmarSenhaInput, "As senha não coincidem")
            return;
        }

        const novoAdmin = {
            nomeAdmin: padronizarNome(nomeInput.value.trim()),
            emailAdmin: emailInput.value.toLowerCase().trim(),
            senhaAdmin: senhaInput.value,
            role: parseInt(funcao.value, 10)
        };

        try {
            const resposta = await fetch(`${API_BASE_URL}/api/Admin/create`, {
                method: 'POST',
                headers: getAuthenticationHeaders(),
                body: JSON.stringify(novoAdmin)
            });

            if (resposta.ok) {
                ativarModal('Cadastro Realizado!', 'Administrador cadastrado com sucesso.', 'aviso',
                    () => {
                        window.location.href = '/client/dashboard/dashboard.html';
                    }
                );
            } else {
                const dadosErro = await resposta.json()
                if (resposta.status === 400 && Array.isArray(dadosErro)) {
                    exibirErros(dadosErro);
                    ativarModal('Dados Inválidos', 'Corrija os campos indicados', 'erro')
                }
                else if (resposta.status === 409) {
                    ativarModal('E-mail em Uso', dadosErro.message, 'erro');
                    erroInput(emailInput, dadosErro.message);
                } else {
                    ativarModal('Erro Inesperado', dadosErro.message || 'Ocorreu um erro no cadastro.', 'erro');
                }
            }
        } catch (erro) {
            console.error("Erro na requisição:", erro);
            ativarModal('Erro Inesperado', 'Erro de conexão com o servidor', 'erro');
        }
    }

    form.addEventListener('submit', handleFormSubmit);
});