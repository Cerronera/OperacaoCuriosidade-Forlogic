document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form_dados');
    const nomeInput = document.getElementById('inome');
    const emailInput = document.getElementById('iemail');
    const funcao = document.getElementById('ifuncao');
    const senhaInput = document.getElementById('isenha');
    const confirmarSenhaInput = document.getElementById('iconfirmarsenha');
    const btn_voltar = document.getElementById('btn_voltar')

    if (btn_voltar) {
        btn_voltar.addEventListener('click', () => voltar());
    }
    function voltar() {
        setTimeout(() => {
            window.location.href = '/client/dashboard/dashboard.html'
        });
    }

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
                sessionStorage.setItem('snackbarMessage' ,'Cadastro realizado'); //alterar para adm ou colab
                window.location.href = '/client/dashboard/dashboard.html';

            } else {
                const dadosErro = await resposta.json()
                if (resposta.status === 400 && Array.isArray(dadosErro)) {
                    exibirErros(dadosErro);
                }
                else if (resposta.status === 409) {
                    erroInput(emailInput, 'E-mail em uso');
                } else {
                   console.error(dadosErro.message);
                }
            }
        } catch (erro) {
            console.error("Erro na requisição:", erro);
        }
    }

    form.addEventListener('submit', handleFormSubmit);
});