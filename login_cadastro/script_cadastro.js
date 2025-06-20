document.addEventListener('DOMContentLoaded', () => {


    function erroinput(input, mensagem) {
        const formItem = input.parentElement
        const textoMensagem = formItem.querySelector("a")
        textoMensagem.innerText = mensagem
        formItem.className = 'form_cadastro erro'
    }

    function sucessoinput(input) {
        const formItem = input.parentElement
        formItem.className = 'form_cadastro'
        const textoMensagem = formItem.querySelector("a")
        if (textoMensagem) {
            textoMensagem.innerText = ""
        }
    }

    function validarEmail(email) {
        const regexEmail = /^[_.]?[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}(?:\.br)?$/i
        return regexEmail.test(email)
    }
    //validação campo por campo

    function checkNome() {
        const nomeValor = nome.value.trim()
        if (nomeValor === '') {
            erroinput(nome, "Campo obrigatório")
            return false
        } else {
            sucessoinput(nome)
            return true
        }
    }

    function checkEmail() {
        const emailValor = email.value.trim()
        if (emailValor === '') {
            erroinput(email, "Campo obrigatório")
            return false
        } else if (!validarEmail(emailValor)) {
            erroinput(email, "Formato incorreto")
        } else {
            sucessoinput(email)
            return true
        }
    }

    function checkSenha() {
        const senhaValor = senha.value
        if (senhaValor === '') {
            erroinput(senha, "Campo obrigatório")
            return false
        } else if (senhaValor.length < 8) {
            erroinput(senha, "A senha deve conter no mínimo 8 caracteres")
            return false
        }
        else {
            sucessoinput(senha)
            return true
        }
    }

    function checkConfirma_senha() {
        const senhaValor = senha.value
        const confirmar_senhaValor = confirmar_senha.value
        if (confirmar_senhaValor === '') {
            erroinput(confirmar_senha, "Campo obrigatório")
            return false
        } else if (senhaValor !== confirmar_senhaValor) {
            erroinput(confirmar_senha, "As Senhas não coincidem")
            return false
        }
        else {
            sucessoinput(confirmar_senha)
            return true
        }
    }

    function checkForm() {
        const camposValidos = [
            checkNome(),
            checkEmail(),
            checkSenha(),
            checkConfirma_senha()
        ]

        const formValido = camposValidos.every(campo => campo === true)
        const submitButton = form.querySelector('button[type = "submit"]')

        if (formValido) {
            //adiciona a classe sucesso e remove a de erro se o formulario for válido
            submitButton.classList.add('sucesso')
            submitButton.classList.remove('erro')
            return true;
        } else {
            //inverso à lógica de validação
            submitButton.classList.add('erro')
            submitButton.classList.remove('sucesso')
            return false;
        }
    }

    async function submitForm() {
        const novoAdmin = {
            nome: nome.value.trim(),
            email: email.value.trim(),
            senha: senha.value,
            tipo: 'admin'
        };

        //Verifica se já há usuários cadastrados
        const adminsExistentes = JSON.parse(localStorage.getItem('admins')) || []
        const emailJaCadastrado = adminsExistentes.some(admin => admin.email === novoAdmin.email)

        if (emailJaCadastrado) {
            erroinput(email, "Este e-mail já está cadastrado por outro usuário")
            return;
        }

        //adiciona o novo usuario
        adminsExistentes.push(novoAdmin)
        localStorage.setItem('admins', JSON.stringify(adminsExistentes));

        alert("Administrador cadastrado com Sucesso!")
        setTimeout(() => {
            window.location.href = '/login_cadastro/login.html'
        }, 1000);
    }

    const form = document.getElementById('form_dados')
    const nome = document.getElementById('inome')
    const email = document.getElementById('iemail')
    const senha = document.getElementById('isenha')
    const confirmar_senha = document.getElementById('iconfirmarsenha')

    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        if (checkForm()) {
            await submitForm()
        }
    });

    nome.addEventListener("blur", checkNome)
    email.addEventListener("blur", checkEmail)
    senha.addEventListener("blur", checkSenha)
    confirmar_senha.addEventListener("blur", checkConfirma_senha)

});



