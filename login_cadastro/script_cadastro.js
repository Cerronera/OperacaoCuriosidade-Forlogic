
const form = document.getElementById('form_dados')
const nome = document.getElementById('inome')
const idade = document.getElementById('iidade')
const telefone = document.getElementById('itelefone')
const email = document.getElementById('iemail')
const endereco = document.getElementById('iendereco')
const outros = document.getElementById('ioutros')
const senha = document.getElementById('isenha')
const confirmar_senha = document.getElementById('iconfirmarsenha')

form.addEventListener('submit', async (event) => {

    event.preventDefault(); //saber explicar
    if (checkForm()) {
        await submitForm();
    }
});

// Confirmação campo por campo:
nome.addEventListener("blur", () => { //blur -> se o campo ficar vazio chama a função
    checkNome()
});

idade.addEventListener("blur", () => {
    checkIdade()
});

telefone.addEventListener("blur", () => {
    checkTelefone()
});

email.addEventListener("blur", () => {
    checkEmail()
});

endereco.addEventListener("blur", () => {
    checkEndereco()
});

outros.addEventListener("blur", () => {
    checkOutros()
});

senha.addEventListener("blur", () => {
    checkSenha()
});

confirmar_senha.addEventListener("blur", () => {
    checkConfirma_senha()
});


function checkNome() {
    const nomeValor = nome.value
    if (nomeValor === '') {
        erroinput(nome, "Preencha o campo Nome")
    } else {
        const formItem = nome.parentElement;
        formItem.className = "form_cadastro"
    }
}

function checkIdade() {
    const idadeValor = idade.value
    if (idadeValor === '') {
        erroinput(idade, "Preencha o campo Idade")
    } else {
        const formItem = idade.parentElement
        formItem.className = "form_cadastro"
    }
}

function checkTelefone() {
    const telefoneValor = telefone.value
    if (telefoneValor === '') {
        erroinput(telefone, "Preencha o campo Telefone")
    } else {
        const formItem = telefone.parentElement
        formItem.className = "form_cadastro"
    }
}

function checkEmail() {
    const emailValor = email.value
    if (emailValor === '') {
        erroinput(email, "Preencha o campo E-mail")
    }else {
        const formItem = email.parentElement
        formItem.className = "form_cadastro"
    }
}

//criar função para validar email com regex - desafio

function checkEndereco() {
    const enderecoValor = endereco.value
    if (enderecoValor === '') {
        erroinput(endereco, "Preencha o campo Endereço")
    } else {
        const formItem = endereco.parentElement
        formItem.className = "form_cadastro"
    }
}

function checkOutros() {
    const outrosValor = outros.value
    if (outrosValor === '') {
        erroinput(outros, "Preencha o campo de Outras Informações")
    } else {
        const formItem = outros.parentElement
        formItem.className = "form_cadastro"
    }
}

function checkSenha() {
    const senhaValor = senha.value
    if (senhaValor === '') {
        erroinput(senha, "Preencha o campo Senha")
    } else if (senhaValor.length < 8) {
        erroinput(senha, "A senha deve conter no mínimo 8 caracteres")
    }
    else {
        const formItem = senha.parentElement
        formItem.className = "form_cadastro"
    }
}

function checkConfirma_senha() {
    const senhaValor = senha.value
    const confirmar_senhaValor = confirmar_senha.value
    if (confirmar_senhaValor === '') {
        erroinput(confirmar_senha, "Preencha o campo de Confirmação de Senha")
    } else if (senhaValor !== confirmar_senhaValor) {
        erroinput(confirmar_senha, "As Senhas não coincidem")
    }
    else {
        const formItem = confirmar_senha.parentElement
        formItem.className = "form_cadastro"
    }
}

//Confirmação Form total:

function checkForm() {
    checkNome()
    checkIdade()
    checkTelefone()
    checkEmail()
    checkEndereco()
    checkOutros()
    checkSenha()
    checkConfirma_senha()
    const formItems = form.querySelectorAll(".form_cadastro");
    const validar = [...formItems].every((item) => {
        return item.className === 'form_cadastro'
    });

    const submitButton = form.querySelector('button[type = "submit"]')

    if (validar) {
        alert("Cadastro Realizado!")
        //adiciona a classe sucesso e remove a de erro se o formulario for válido
        submitButton.classList.add('sucesso')
        submitButton.classList.remove('erro')
        return true;
    } else {
        //Alert caso passe pela validação dos campos vazios porém com dados inválidos
        alert("Preencha os campos corretamente")
        //inverso à lógica de validação
        submitButton.classList.add('erro')
        submitButton.classList.remove('sucesso')
        return false;
    }
}

function erroinput(input, mensagem) {
    const formItem = input.parentElement
    const textoMensagem = formItem.querySelector("a")
    textoMensagem.innerText = mensagem
    formItem.className = 'form_cadastro erro'
}

//Armazenar dados corretos no LocalStorage
async function submitForm() {
    const novoUsuario = {
        nome: nome.value,
        idade: idade.value,
        telefone: telefone.value,
        email: email.value,
        endereco: endereco.value,
        outros: outros.value,
        senha: senha.value
    };
    //Verifica se já há usuários cadastrados
    const dadosExistentes = JSON.parse(localStorage.getItem('usuarios')) || []
    const emailJaCadastrado = dadosExistentes.some(user => user.email === novoUsuario.email)
    if (emailJaCadastrado) {
        alert("Este e-mail já está cadastrado.")
        return;
    }
    //adiciona o novo usuario
    dadosExistentes.push(novoUsuario)
    localStorage.setItem('usuarios', JSON.stringify(dadosExistentes));

    alert("Cadastro salvo com Sucesso!")
    setTimeout(() => {
        window.location.href = '/login_cadastro/login.html'
    }, 1000);
}



