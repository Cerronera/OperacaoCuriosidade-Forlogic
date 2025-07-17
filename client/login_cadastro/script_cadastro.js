document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form_dados');
    const nomeInput = document.getElementById('inome');
    const emailInput = document.getElementById('iemail');
    const funcao = parseInt(document.getElementById('ifuncao'), 10);
    const senhaInput = document.getElementById('isenha');
    const confirmarSenhaInput = document.getElementById('iconfirmarsenha');
    const submitButton = document.getElementById('submit');


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

    async function handleFormSubmit(event) {
        event.preventDefault();

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
            adminName: nomeInput.value.trim(),
            adminEmail: emailInput.value.toLowerCase().trim(),
            adminPassword: senhaInput.value,
            role: funcao
        };

        try {
            const resposta = await fetch(`${API_BASE_URL}/api/Admin/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoAdmin)
            });

            if (resposta.ok) {
                ativarModal('Cadastro Realizado!', 'Administrador cadastrado com sucesso.', 'aviso',
                    () => {
                        window.location.href = '/client/dashboard/dashboard.html';
                    }
                );
            } else if (resposta.status === 400) {
                const dadosErro = await resposta.json()
                const mensagens = Object.values(dadosErro.errors).flat()
                ativarModal('Erro no Cadastro', mensagens.join('<br>'), 'erro')
            } else {
                const texto = await resposta.text()
                ativarModal('Erro Inesperado', texto || 'Erro no cadastro', 'erro')
            }

        } catch (erro) {
            console.error("Erro na requisição:", erro);
            ativarModal('Erro Inesperado', 'Erro de conexão com o servidor', 'erro');
        }
    }

    form.addEventListener('submit', handleFormSubmit);
});