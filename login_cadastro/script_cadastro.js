document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form_dados');
    const nomeInput = document.getElementById('inome');
    const emailInput = document.getElementById('iemail');
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

    function checkNome() {
        if (nomeInput.value.trim() === '') {
            erroInput(nomeInput, "Campo obrigatório");
            return false;
        }
        sucessoInput(nomeInput);
        return true;
    }

    function checkEmail() {
        const regexEmail = /^[_.]?[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}(?:\.br)?$/i;
        if (emailInput.value.trim() === '' || !regexEmail.test(emailInput.value)) {
            erroInput(emailInput, "Formato de e-mail inválido");
            return false;
        }
        sucessoInput(emailInput);
        return true;
    }

    function checkSenha() {
        if (senhaInput.value.length < 8) {
            erroInput(senhaInput, "A senha deve conter no mínimo 8 caracteres");
            return false;
        }
        sucessoInput(senhaInput);
        return true;
    }

    function checkConfirmaSenha() {
        if (senhaInput.value !== confirmarSenhaInput.value) {
            erroInput(confirmarSenhaInput, "As senhas não coincidem");
            return false;
        }
        sucessoInput(confirmarSenhaInput);
        return true;
    }



    async function handleFormSubmit(event) {
        event.preventDefault(); 

        const nomeValido = checkNome();
        const emailValido = checkEmail();
        const senhaValida = checkSenha();
        const confirmaSenhaValida = checkConfirmaSenha();

        if (!nomeValido || !emailValido || !senhaValida || !confirmaSenhaValida) {
            submitButton.classList.add('erro');
            submitButton.classList.remove('sucesso');
            return;
        }

        const novoAdmin = {
            nome: nomeInput.value.trim(),
            email: emailInput.value.toLowerCase().trim(),
            senha: senhaInput.value,
            tipo: 'admin'
        };

        const adminsExistentes = JSON.parse(localStorage.getItem('admins')) || [];
        const emailJaCadastrado = adminsExistentes.some(admin => admin.email === novoAdmin.email);

        if (emailJaCadastrado) {
            erroInput(emailInput, "Este e-mail já está cadastrado");
            submitButton.classList.add('erro');
            submitButton.classList.remove('sucesso');
            ativarModal('E-mail em Uso', 'Este e-mail já está cadastrado para outro administrador.', 'erro');
            return;
        }

        try {
            adminsExistentes.push(novoAdmin);
            localStorage.setItem('admins', JSON.stringify(adminsExistentes));
            
            submitButton.classList.add('sucesso');
            submitButton.classList.remove('erro');

            ativarModal('Cadastro Realizado!', 'Administrador cadastrado com sucesso.', 'aviso',
                () => { 
                    window.location.href = '/login_cadastro/login.html';
                }
            );

        } catch (error) {
            console.error("Erro ao salvar no localStorage:", error);
            ativarModal('Erro Inesperado', 'Ocorreu um erro ao salvar os dados. Por favor, tente novamente.', 'erro');
        }
    }

    form.addEventListener('submit', handleFormSubmit);

    nomeInput.addEventListener("blur", checkNome);
    emailInput.addEventListener("blur", checkEmail);
    senhaInput.addEventListener("blur", checkSenha);
    confirmarSenhaInput.addEventListener("blur", checkConfirmaSenha);
});