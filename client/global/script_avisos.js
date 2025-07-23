const modalAvisos = document.getElementById('modal_avisos');
const avisoHeader = modalAvisos.querySelector('.modal_header');
const avisoBody = modalAvisos.querySelector('.modal_body');
const btnFecharAviso = document.getElementById('btn_fechar_aviso');
const avisoShadow = modalAvisos.querySelector('.modal_shadow');

const modalConfirmacao = document.getElementById('modal_confirmacao');
const confirmacaoHeader = modalConfirmacao.querySelector('.modal_header');
const confirmacaoBody = modalConfirmacao.querySelector('.modal_body');
const confirmacaoShadow = modalConfirmacao.querySelector('.modal_shadow');
const btnConfirmar = document.getElementById('btn_confirmar');
const btnCancelar = document.getElementById('btn_cancelar');


function abrirModalAvisos(modalElement, shadowElement) {
    modalElement.classList.remove('animacao-sair');
    shadowElement.classList.remove('shadow-animacao-sair');

    modalElement.classList.add('visivel', 'animacao-entrar');
    shadowElement.classList.add('visivel', 'shadow-animacao-entrar');
    document.body.classList.add('modal-aviso-aberto');
}

function fecharModalAvisos(modalElement, shadowElement, callback) {
    modalElement.classList.remove('animacao-entrar');
    shadowElement.classList.remove('shadow-animacao-entrar');
    modalElement.classList.add('animacao-sair');
    shadowElement.classList.add('shadow-animacao-sair');

    const aoTerminarAnimacao = () => {
        modalElement.classList.remove('visivel', 'animacao-sair');
        shadowElement.classList.remove('visivel', 'shadow-animacao-sair');
        document.body.classList.remove('modal-aviso-aberto');

        if (typeof callback === 'function') {
           callback();
        }
    };
    modalElement.addEventListener('animationend', aoTerminarAnimacao, { once: true});
}

function ativarModal(titulo, descricao, tipo = 'aviso', callback = null) {
    if (!modalAvisos){ 
        return;
    }
    modalAvisos.classList.remove('tipo-erro', 'tipo-aviso');
    modalAvisos.classList.add(`tipo-${tipo}`);

    const iconeHtml = tipo === 'erro'
        ? '<i class="fa fa-exclamation-triangle"></i>' 
        : '<i class="fa fa-info-circle"></i>';

    avisoHeader.innerHTML = `${iconeHtml} <p>${titulo}</p>`;
    avisoBody.innerHTML = `<p>${descricao}</p>`;

    abrirModalAvisos(modalAvisos, avisoShadow);

    const acaoFechar = () => {
        fecharModalAvisos(modalAvisos, avisoShadow, callback);
    };

    setTimeout(() => {
        btnFecharAviso.addEventListener('click', acaoFechar, {once: true});
        avisoShadow.addEventListener('click', acaoFechar, {once: true});
    }, 50)
}

function ativarConfirmacao(titulo, descricao) {
    return new Promise((resolve) => {
        if (!modalConfirmacao) {
            resolve(false);
            return;
        }

        confirmacaoHeader.innerHTML = `<i class="fa fa-exclamation-triangle"></i> <p>${titulo}</p>`;
        confirmacaoBody.innerHTML = `<p>${descricao}</p>`;

        abrirModalAvisos(modalConfirmacao, confirmacaoShadow);

        const resolverAcao = (resultado) => {
           fecharModalAvisos(modalConfirmacao, confirmacaoShadow);
           resolve(resultado);
        };

        btnConfirmar.addEventListener('click',() => resolverAcao(true), {once:true});
        btnCancelar.addEventListener('click',() =>  resolverAcao(false), {once:true});
        confirmacaoShadow.addEventListener('click',() =>resolverAcao(false), {once:true});
    });
}