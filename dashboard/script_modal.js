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
    // Implementação futura
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
});