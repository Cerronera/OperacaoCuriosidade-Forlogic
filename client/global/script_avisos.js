const modalConfirmacao = document.getElementById('modal_confirmacao');
const confirmacaoHeader = modalConfirmacao.querySelector('.modal_header');
const confirmacaoBody = modalConfirmacao.querySelector('.modal_body');
const confirmacaoShadow = modalConfirmacao.querySelector('.modal_shadow');
const btnConfirmar = document.getElementById('btn_confirmar');
const btnCancelar = document.getElementById('btn_cancelar');

function abrirModal(modalElement, shadowElement) {
    modalElement.classList.remove('animacao-sair');
    shadowElement.classList.remove('shadow-animacao-sair');

    modalElement.classList.add('visivel', 'animacao-entrar');
    shadowElement.classList.add('visivel', 'shadow-animacao-entrar');
    document.body.classList.add('modal-aviso-aberto');
}

function fecharModal(modalElement, shadowElement) {
    modalElement.classList.remove('animacao-entrar');
    shadowElement.classList.remove('shadow-animacao-entrar');
    modalElement.classList.add('animacao-sair');
    shadowElement.classList.add('shadow-animacao-sair');
    modalElement.addEventListener('animationend', () => {
        modalElement.classList.remove('visivel', 'animacao-sair');
        shadowElement.classList.remove('visivel', 'shadow-animacao-sair');
        document.body.classList.remove('modal-aviso-aberto');
    }, { once: true });
}

function ativarConfirmacao(titulo, descricao) {
    return new Promise((resolve) => {
        if (!modalConfirmacao) {
            resolve(false);
            return;
        }

        confirmacaoHeader.innerHTML = `<i class="fa fa-exclamation-triangle"></i> <p>${titulo}</p>`;
        confirmacaoBody.innerHTML = `<p>${descricao}</p>`;

        abrirModal(modalConfirmacao, confirmacaoShadow);

        const resolverAcao = (resultado) => {
            fecharModal(modalConfirmacao, confirmacaoShadow);
            resolve(resultado);
        };

        btnConfirmar.addEventListener('click', () => resolverAcao(true), { once: true });
        btnCancelar.addEventListener('click', () => resolverAcao(false), { once: true });
        confirmacaoShadow.addEventListener('click', () => resolverAcao(false), { once: true });
    });
}

function mostrarSnackbar(mensagem, tipo = 'sucesso', duracao = 4000) {
    const container = document.getElementById('snackbar_container');
    if (!container) {
        return;
    }

    const snackbar = document.createElement('div');
    snackbar.className = `snackbar ${tipo}`;

    const icone = tipo === 'sucesso'
        ? '<i class="fa fa-check-circle"></i>'
        : '<i class="fa fa-exclamation-triangle"></i>';
    snackbar.innerHTML = `${icone} <p>${mensagem}</p>`;

    container.appendChild(snackbar);

    setTimeout(() => {
        snackbar.classList.add('sair');

        snackbar.addEventListener('animationend', () => {
            snackbar.remove();
        });
    }, duracao)
}

function checarSnackbar(){
    const snackbarDataString = sessionStorage.getItem('snackbarData');

    if(!snackbarDataString){
        return;
    }

    const snackbarData = JSON.parse(snackbarDataString);
    mostrarSnackbar(snackbarData.mensagem, snackbarData.tipo);
    sessionStorage.removeItem('snackbarData')
}