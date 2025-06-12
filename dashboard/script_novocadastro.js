
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

document.addEventListener('DOMContentLoaded', () => {

    //como cadastro vai virar um modal futuramente, acho que nao tem porque mexer com a barra de pesquisas dessa pagina.


    // Armazenar dados de cadastro no localstorage
    const form = document.getElementById('form_novo_cadastro');
    if (!form) return;

    const ativo = document.getElementById('idativo');
    const nome = document.getElementById('idnome');
    const idade = document.getElementById('ididade');
    const telefone = document.getElementById('idtelefone');
    const email = document.getElementById('idemail');
    const endereco = document.getElementById('idendereco');
    const outros = document.getElementById('idoutros');
    const interesses = document.getElementById('idinteresses');
    const sentimentos = document.getElementById('idsentimentos');
    const valores = document.getElementById('idvalores');

    console.log('status:',ativo.checked)

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (checkForm()) {
            await submitForm();
        }
    });

    // Confirmação campo por campo:
    nome.addEventListener("blur", () => checkNome());
    idade.addEventListener("blur", () => checkIdade());
    email.addEventListener("blur", () => checkEmail());
    telefone.addEventListener("blur", () => checkTelefone());
    endereco.addEventListener("blur", () => checkEndereco());
    outros.addEventListener("blur", () => checkOutros());
    interesses.addEventListener("blur", () => checkInteresses());
    sentimentos.addEventListener("blur", () => checkSentimentos());
    valores.addEventListener("blur", () => checkValores());

    function checkNome() {
        const nomeValor = nome.value;
        if (nomeValor === '') {
            erroinput(nome, "Campo obrigatório");
        } else {
            const formItem = nome.parentElement;
            formItem.className = "form";
        }
    }

    function checkIdade() {
        const idadeValor = idade.value;
        if (idadeValor === '') {
            erroinput(idade, "Campo obrigatório");
        } else if (!validarIdade(idadeValor)) {
            erroinput(idade, "Valor não aceito");
        } else {
            const formItem = idade.parentElement;
            formItem.className = "form";
        }
    }

    function validarIdade(idade) {
        return !(idade < 16 || idade > 80);
    }

    function checkEmail() {
        const emailValor = email.value;
        if (emailValor === '') {
            erroinput(email, "Campo obrigatório");
        } else if (!validarEmail(emailValor)) {
            erroinput(email, "Formato incorreto")
        } else {
            const formItem = email.parentElement;
            formItem.className = "form";
        }
    }

    function validarEmail(email) {
        const regexEmail = /^[_.]?[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}(?:\.br)?$/i; //aceita . _ numeros no inicio, aceita .br no final

        return regexEmail.test(email)
    }

    function checkTelefone() {
        const telefoneValor = telefone.value;
        if (telefoneValor === '') {
            erroinput(telefone, "Campo obrigatório");
        } else if (!validarTelefone(telefoneValor)) {
            erroinput(telefone, "Formato incorreto");
        } else {
            const formItem = telefone.parentElement;
            formItem.className = "form";
        }
    }

    function validarTelefone(telefone) {
        const regexTelefone = /^\(?([1-9]{2})\)? ?(9?[0-9]{4})-?([0-9]{4})$/

        //aceita ddd a partir de 1, e aceita telefones fixos (8 numeros) e celulares (9 numeros)
        return regexTelefone.test(telefone)
    }

    function checkEndereco() {
        const enderecoValor = endereco.value;
        if (enderecoValor === '') {
            erroinput(endereco, "Campo obrigatório");
        } else {
            const formItem = endereco.parentElement;
            formItem.className = "form";
        }
    }

    function checkOutros() {
        const outrosValor = outros.value;
        if (outrosValor === '') {
            erroinput(outros, "Campo obrigatório");
        } else {
            const formItem = outros.parentElement;
            formItem.className = "form";
        }
    }

    function checkInteresses() {
        const interessesValor = interesses.value;
        if (interessesValor === '') {
            erroinput(interesses, "Campo obrigatório");
        } else {
            const formItem = interesses.parentElement;
            formItem.className = "form";
        }
    }

    function checkSentimentos() {
        const sentimentosValor = sentimentos.value;
        if (sentimentosValor === '') {
            erroinput(sentimentos, "Campo obrigatório");
        } else {
            const formItem = sentimentos.parentElement;
            formItem.className = "form";
        }
    }

    function checkValores() {
        const valoresValor = valores.value;
        if (valoresValor === '') {
            erroinput(valores, "Campo obrigatório");
        } else {
            const formItem = valores.parentElement;
            formItem.className = "form";
        }
    }

    function checkForm() {
        checkNome();
        checkIdade();
        checkEmail();
        checkTelefone();
        checkEndereco();
        checkOutros();
        checkInteresses();
        checkSentimentos();
        checkValores();

        const formItems = form.querySelectorAll(".form");
        const validar = [...formItems].every((item) => item.className === 'form');

        const submitButton = form.querySelector('button[type = "submit"]');

        if (validar) {
            const emailValor = email.value.toLowerCase().trim()
            const dadosExistentes = JSON.parse(localStorage.getItem('usuarios')) || [];
            const emailJaCadastrado = dadosExistentes.some(user => user.email === emailValor);

            if (emailJaCadastrado) {
                alert("Este e-mail já está cadastrado.");
                submitButton.classList.add('erro');
                submitButton.classList.remove('sucesso');
                return false;
            }
            //se passou nas validações:
            submitButton.classList.add('sucesso');
            submitButton.classList.remove('erro');
            return true;
        } else {
            alert("Preencha os campos corretamente");
            submitButton.classList.add('erro');
            submitButton.classList.remove('sucesso');
            return false;
        }
    }

    function erroinput(input, mensagem) {
        const formItem = input.parentElement;
        const textoMensagem = formItem.querySelector("a");
        textoMensagem.innerText = mensagem;
        formItem.className = 'form erro';
    }

    async function submitForm() {
        const novoUsuario = {
            status: ativo.checked ? "Ativo" : "Inativo",
            nome: nome.value.trim(),
            idade: idade.value.trim(),
            email: email.value.toLowerCase().trim(),
            telefone: telefone.value.trim(),
            endereco: endereco.value.trim(),
            outros: outros.value.trim(),
            interesses: interesses.value.trim(),
            sentimentos: sentimentos.value.trim(),
            valores: valores.value.trim(),
            dataCadastro: new Date().toISOString(),
            revisado: false
        };
          console.log('status:',novoUsuario.status)

        const dadosExistentes = JSON.parse(localStorage.getItem('usuarios')) || [];
        dadosExistentes.push(novoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(dadosExistentes));

        alert("Cadastro salvo com Sucesso!");
        setTimeout(() => {
            window.location.href = '/dashboard/cadastros.html';
        }, 1000);
    }
});