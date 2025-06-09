
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

    if (document.getElementById('bloco_1')) {
        atualizarBlocos();
    }

    //barra de pesquisa do header:
    const campoPesquisa = document.getElementById('campoPesquisa')
    const resultadosPesquisa = document.getElementById('resultadosPesquisa')
    

    campoPesquisa.addEventListener('input', function () {
        const termo = this.value.toLowerCase().trim(); //para nao ter diferença entre maiusculas e minusculas
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

        resultadosPesquisa.innerHTML = ''

        if (!termo) {
            resultadosPesquisa.style.display = 'none'
            //quando a pesquisa estiver vazia, todas as tr voltam a ficar visíveis.
            const linhas = tabela.getElementsByTagName('tr')
            for (let i = 0; i< linhas.length; i++){
                linhas[i].style.display='';
            }

            return;
        }

        const resultados = usuarios.filter(usuario =>
            usuario.nome && usuario.nome.toLowerCase().includes(termo) // filter percorre a array e mantem resultados cujo nome contem o termo digitado
        );

        if (resultados.length === 0) {
            resultadosPesquisa.style.display = 'none'
            return;
        }

        //cria uma div dinamicamente e coloca o nome do usuario dentro dessa div
        resultados.forEach(usuario => {
            const item = document.createElement('div');
            item.textContent = usuario.nome
            item.style.padding = '8px';
            item.style.cursor = 'pointer'

            item.addEventListener('click', () => {
                //configuração caso clique no resultado da pesquisa
                alert(`${usuario.nome} selecionado`)
                campoPesquisa.value = ''
                resultadosPesquisa.style.display = 'none'
            });

            resultadosPesquisa.appendChild(item); //adiciona ao resultadosPesquisa
        });

        resultadosPesquisa.style.display = 'block'

        //Filtra a tabela com os usuarios que combinam com a barra de pesquisa
        const linhas = tabela.getElementsByTagName('tr')
        for (let i = 0; i < linhas.length; i++){
            const linha = linhas[i]
            const nomeCelula = linha.cells[0]

            if(nomeCelula){
                const nome = nomeCelula.textContent.toLowerCase()

                if(nome.includes(termo)){
                    linha.style.display = '';
                } else{
                    linha.style.display= 'none'
                }
            }
        }

    });

    document.addEventListener('click', function (e) {
        if (!campoPesquisa.contains(e.target)) {
            resultadosPesquisa.style.display = 'none'
        }
    });


    //puxar dados do localstorage para a tabela:
    const tabela = document.querySelector('#tabela_usuarios tbody')
    if (tabela) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []

        usuarios.forEach((usuario, index) => {
            const tr = document.createElement('tr')
            tr.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.telefone}</td>
            <td>${usuario.status}</td>
        `;
            tabela.appendChild(tr);

        });

    }

    // Armazenar dados de cadastro no localstorage
    const form = document.getElementById('form_novo_cadastro')
    if (!form) return;
    const ativo = document.getElementById('idativo')
    const nome = document.getElementById('idnome')
    const idade = document.getElementById('ididade')
    const telefone = document.getElementById('idtelefone')
    const email = document.getElementById('idemail')
    const endereco = document.getElementById('idendereco')
    const outros = document.getElementById('idoutros')
    const interesses = document.getElementById('idinteresses')
    const sentimentos = document.getElementById('idsentimentos')
    const valores = document.getElementById('idvalores')

    form.addEventListener('submit', async (event) => {

        event.preventDefault(); //saber explicar
        if (checkForm()) {
            await submitForm()
        }
    });

    // Confirmação campo por campo:
    nome.addEventListener("blur", () => { //blur -> se o campo ficar vazio chama a função
        checkNome()
    });

    idade.addEventListener("blur", () => {
        checkIdade()
    });

    email.addEventListener("blur", () => {
        checkEmail()
    });

    telefone.addEventListener("blur", () => {
        checkTelefone()
    });

    endereco.addEventListener("blur", () => {
        checkEndereco()
    });

    outros.addEventListener("blur", () => {
        checkOutros()
    })

    interesses.addEventListener("blur", () => {
        checkInteresses()
    })

    sentimentos.addEventListener("blur", () => {
        checkSentimentos()
    })

    valores.addEventListener("blur", () => {
        checkValores()
    })

    function checkNome() {
        const nomeValor = nome.value
        if (nomeValor === '') {
            erroinput(nome, "Campo obrigatório")
        } else {
            const formItem = nome.parentElement;
            formItem.className = "form"
        }
    }

    function checkIdade() {
        const idadeValor = idade.value
        if (idadeValor === '') {
            erroinput(idade, "Campo obrigatório")
        } else if (!validarIdade(idadeValor)) {
            erroinput(idade, "Valor não aceito")
        } else {
            const formItem = idade.parentElement
            formItem.className = "form"
        }
    }

    function validarIdade(idade) {
        if (idade < 16 || idade > 80) {
            return false;
        } else {
            return true
        }
    }

    //criar função para validar email com regex - desafio
    function checkEmail() {
        const emailValor = email.value
        if (emailValor === '') {
            erroinput(email, "Campo obrigatório")
        } else {
            const formItem = email.parentElement
            formItem.className = "form"
        }
    }

    function checkTelefone() {
        const telefoneValor = telefone.value
        if (telefoneValor === '') {
            erroinput(telefone, "Campo obrigatório")
        } else if (!validarTelefone(telefoneValor)) {
            erroinput(telefone, "Formato incorreto")
        } else {
            const formItem = telefone.parentElement
            formItem.className = "form"
        }
    }

    function validarTelefone(telefone) {
        telefone = telefone.replace(/\D/g, '') //retira todos caracteres menos numeros
        if (!(telefone.length >= 10 && telefone.length <= 11)) return false

        if (telefone.length == 11 && parseInt(telefone.substring(2, 3)) != 9) return false //com 11 numeros, verifica se começa com 9

        for (var n = 0; n < 10; n++) {
            if (telefone == new Array(11).join(n) || telefone == new Array(12).join(n)) return false
        }
        //se passar pelas validações acima retorna true
        return true;
    }

    function checkEndereco() {
        const enderecoValor = endereco.value
        if (enderecoValor === '') {
            erroinput(endereco, "Campo obrigatório")
        } else {
            const formItem = endereco.parentElement
            formItem.className = "form"
        }
    }

    function checkOutros() {
        const outrosValor = outros.value
        if (outrosValor === '') {
            erroinput(outros, "Campo obrigatório")
        } else {
            const formItem = outros.parentElement
            formItem.className = "form"
        }
    }

    function checkInteresses() {
        const interessesValor = interesses.value
        if (interessesValor === '') {
            erroinput(interesses, "Campo obrigatório")
        } else {
            const formItem = interesses.parentElement
            formItem.className = "form"
        }
    }

    function checkSentimentos() {
        const sentimentosValor = sentimentos.value
        if (sentimentosValor === '') {
            erroinput(sentimentos, "Campo obrigatório")
        } else {
            const formItem = sentimentos.parentElement
            formItem.className = "form"
        }
    }

    function checkValores() {
        const valoresValor = valores.value
        if (valoresValor === '') {
            erroinput(valores, "Campo obrigatório")
        } else {
            const formItem = valores.parentElement
            formItem.className = "form"
        }
    }

    //Confirmação Form total:

    function checkForm() {
        checkNome()
        checkIdade()
        checkEmail()
        checkTelefone()
        checkEndereco()
        checkOutros()
        checkInteresses()
        checkSentimentos()
        checkValores()
        const formItems = form.querySelectorAll(".form");
        const validar = [...formItems].every((item) => {
            return item.className === 'form'
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
        formItem.className = 'form erro'
    }

    //Armazenar dados corretos no LocalStorage
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
            dataCadastro: new Date().toISOString(), //armazenar a data em que o cadastro foi feito
            revisado: false //  novos cadastros começam como não revisado
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
            window.location.href = '/dashboard/cadastros.html'
        }, 1000);
    }


});
