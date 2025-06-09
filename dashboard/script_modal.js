// Funções de navegação
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

// Função para fechar modal
function fecharModal() {
    document.getElementById('modal_edicao').classList.add('oculto')
}


// Carregar dados na tabela e configurar edição
document.addEventListener('DOMContentLoaded', () => {

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
            for (let i = 0; i < linhas.length; i++) {
                linhas[i].style.display = '';
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
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []
                
                const index = usuarios.findIndex(u =>
                    u.nome === usuario.nome
                    //isso ta estranho  
                );

                if(index !== -1){
                    const modal = document.getElementById('modal_edicao')
                    modal.dataset.index = index
                    modal.classList.remove('oculto')

                    const usuarioSelecionado = usuarios[index]
                    document.getElementById('edit_nome').value = usuarioSelecionado.nome
                    document.getElementById('edit_idade').value = usuarioSelecionado.idade
                    document.getElementById('edit_email').value = usuarioSelecionado.email
                    document.getElementById('edit_telefone').value = usuarioSelecionado.telefone
                    document.getElementById('edit_endereco').value = usuarioSelecionado.endereco
                    document.getElementById('edit_outros').value = usuarioSelecionado.outros
                    document.getElementById('edit_interesses').value = usuarioSelecionado.interesses
                    document.getElementById('edit_sentimentos').value = usuarioSelecionado.sentimentos
                    document.getElementById('edit_valores').value = usuarioSelecionado.valores
                    document.getElementById('edit_ativo').checked = usuario.status
                }

                resultadosPesquisa.style.display = 'none'

            });

            resultadosPesquisa.appendChild(item); //adiciona ao resultadosPesquisa
        });

        resultadosPesquisa.style.display = 'block'

        //Filtra a tabela com os usuarios que combinam com a barra de pesquisa
        const linhas = tabela.getElementsByTagName('tr')
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i]
            const nomeCelula = linha.cells[0]

            if (nomeCelula) {
                const nome = nomeCelula.textContent.toLowerCase()

                if (nome.includes(termo)) {
                    linha.style.display = '';
                } else {
                    linha.style.display = 'none'
                }
            }
        }

    });

    document.addEventListener('click', function (e) {
        if (!campoPesquisa.contains(e.target)) {
            resultadosPesquisa.style.display = 'none'
        }
    });

    const tabela = document.querySelector('#tabela_usuarios tbody')
    if (tabela) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []

        usuarios.forEach((usuario, index) => {
            const tr = document.createElement('tr')
            tr.dataset.index = index
            tr.innerHTML = `
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${usuario.telefone}</td>
                <td>${usuario.status}</td>
            `;
            tabela.appendChild(tr);
        });

        // Evento para abrir modal de edição
        tabela.addEventListener('click', (event) => {
            const linha = event.target.closest('tr')
            if (!linha) return;

            const index = linha.dataset.index
            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []
            const usuario = usuarios[index];

            // Preencher modal com dados do usuário
            document.getElementById('edit_nome').value = usuario.nome
            document.getElementById('edit_idade').value = usuario.idade
            document.getElementById('edit_email').value = usuario.email
            document.getElementById('edit_telefone').value = usuario.telefone
            document.getElementById('edit_endereco').value = usuario.endereco
            document.getElementById('edit_outros').value = usuario.outros
            document.getElementById('edit_interesses').value = usuario.interesses
            document.getElementById('edit_sentimentos').value = usuario.sentimentos
            document.getElementById('edit_valores').value = usuario.valores
            document.getElementById('edit_ativo').checked = usuario.status

            document.getElementById('modal_edicao').dataset.index = index
            document.getElementById('modal_edicao').classList.remove('oculto')

            //reseta o scroll no inicio
            document.getElementById('modal_edicao').scrollTop = 0;
        });

        // Cancelar Edição
        const botaoCancelar = document.getElementById('cancelar')
        const modal = document.getElementById('modal_edicao')
        if (botaoCancelar) {
            botaoCancelar.addEventListener('click', () => {
                modal.classList.add('oculto')
            })
        }

        //Confirmar se os campos estao preenchidos corretamente:
        function erroinput(input, mensagem) {
            const formItem = input.parentElement;
            const textoMensagem = formItem.querySelector("a");
            textoMensagem.innerText = mensagem;
            formItem.className = 'form erro';
        }

        function validarIdade(idade) {
            if (idade < 16 || idade > 80) {
                return false;
            }
            return true;
        }

        function validarTelefone(telefone) {
            telefone = telefone.replace(/\D/g, '');
            if (!(telefone.length >= 10 && telefone.length <= 11)) return false;
            if (telefone.length == 11 && parseInt(telefone.substring(2, 3)) != 9) return false;
            return true;
        }

        //função para validar email com regex


        function checkEditNome() {
            const nome = document.getElementById('edit_nome');
            const nomeValor = nome.value;
            if (nomeValor === '') {
                erroinput(nome, "Campo obrigatório");
                return false;
            }
            const formItem = nome.parentElement;
            formItem.className = "form_modal";
            return true;
        }

        function checkEditIdade() {
            const idade = document.getElementById('edit_idade');
            const idadeValor = idade.value;
            if (idadeValor === '') {
                erroinput(idade, "Campo obrigatório");
                return false;
            } else if (!validarIdade(idadeValor)) {
                erroinput(idade, "Valor não aceito");
                return false;
            }
            const formItem = idade.parentElement;
            formItem.className = "form_modal";
            return true;
        }

        function checkEditEmail() {
            const email = document.getElementById('edit_email');
            const emailValor = email.value;
            if (emailValor === '') {
                erroinput(email, "Campo obrigatório");
                return false;
            } else {
                const formItem = email.parentElement;
                formItem.className = "form_modal";
                return true;
            }
        }

        function checkEditTelefone() {
            const telefone = document.getElementById('edit_telefone');
            const telefoneValor = telefone.value;
            if (telefoneValor === '') {
                erroinput(telefone, "Campo obrigatório");
                return false;
            } else if (!validarTelefone(telefoneValor)) {
                erroinput(telefone, "Formato incorreto");
                return false;
            }
            const formItem = telefone.parentElement;
            formItem.className = "form_modal";
            return true;
        }

        function checkEditEndereco() {
            const endereco = document.getElementById('edit_endereco');
            const enderecoValor = endereco.value;
            if (enderecoValor === '') {
                erroinput(endereco, "Campo obrigatório");
                return false;
            }
            const formItem = endereco.parentElement;
            formItem.className = "form_modal";
            return true;
        }

        function checkEditOutros() {
            const outros = document.getElementById('edit_outros');
            const outrosValor = outros.value;
            if (outrosValor === '') {
                erroinput(outros, "Campo obrigatório");
                return false;
            }
            const formItem = outros.parentElement;
            formItem.className = "form_modal";
            return true;
        }

        function checkEditInteresses() {
            const interesses = document.getElementById('edit_interesses');
            const interessesValor = interesses.value;
            if (interessesValor === '') {
                erroinput(interesses, "Campo obrigatório");
                return false;
            }
            const formItem = interesses.parentElement;
            formItem.className = "form_modal";
            return true;
        }

        function checkEditSentimentos() {
            const sentimentos = document.getElementById('edit_sentimentos');
            const sentimentosValor = sentimentos.value;
            if (sentimentosValor === '') {
                erroinput(sentimentos, "Campo obrigatório");
                return false;
            }
            const formItem = sentimentos.parentElement;
            formItem.className = "form_modal";
            return true;
        }

        function checkEditValores() {
            const valores = document.getElementById('edit_valores');
            const valoresValor = valores.value;
            if (valoresValor === '') {
                erroinput(valores, "Campo obrigatório");
                return false;
            }
            const formItem = valores.parentElement;
            formItem.className = "form_modal";
            return true;
        }

        //validação de todo o formulario:
        function checkEditForm() {
            const valido =
                checkEditNome() &&
                checkEditIdade() &&
                checkEditEmail() &&
                checkEditTelefone() &&
                checkEditEndereco() &&
                checkEditOutros() &&
                checkEditInteresses() &&
                checkEditSentimentos() &&
                checkEditValores();

            const botaoSalvar = document.getElementById('salvar')

            if (valido) {
                botaoSalvar.classList.add('sucesso');
                botaoSalvar.classList.remove('erro');
                return true;
            } else {
                alert("Preencha os campos corretamente");
                botaoSalvar.classList.add('erro');
                botaoSalvar.classList.remove('sucesso');
                return false;
            }
        }

        // Salvar Edições
        const botaoSalvar = document.getElementById('salvar')
        if (botaoSalvar) {
            botaoSalvar.addEventListener('click', () => {


                if (!checkEditForm()) {
                    return;
                }

                const modal = document.getElementById('modal_edicao');
                const index = modal.dataset.index;
                let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

                usuarios[index] = {
                    ...usuarios[index],
                    status: document.getElementById('edit_ativo').checked ? "Ativo" : "Inativo",
                    nome: document.getElementById('edit_nome').value.trim(),
                    idade: document.getElementById('edit_idade').value.trim(),
                    email: document.getElementById('edit_email').value.trim(),
                    telefone: document.getElementById('edit_telefone').value.trim(),
                    endereco: document.getElementById('edit_endereco').value.trim(),
                    outros: document.getElementById('edit_outros').value.trim(),
                    interesses: document.getElementById('edit_interesses').value.trim(),
                    sentimentos: document.getElementById('edit_sentimentos').value.trim(),
                    valores: document.getElementById('edit_valores').value.trim(),
                    revisado: true //ao salvar coloca como true
                };

                //atualizar lista de usuarios
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                modal.classList.add('oculto');

                if (document.getElementById('bloco_1')) {
                    atualizarBlocos();
                }

                alert("Dados atualizados com sucesso!");
                location.reload();

            });

        }
    }


    //Excluir dados do localstorage

    const botaoExcluir = document.getElementById('excluir')
    if (botaoExcluir) {
        botaoExcluir.addEventListener('click', () => {
            if (!confirm("Quer excluir esse cadastro?")) {
                return;
            }

            const modal = document.getElementById('modal_edicao');
            const index = modal.dataset.index;
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

            // Remove o usuário do array
            usuarios.splice(index, 1);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            modal.classList.add('oculto');

            //atualiza o bloco
            if (document.getElementById('bloco_1')) {
                atualizarBlocos();
            }

            alert('Cadastro excluído');
            location.reload();
        });
    }
});