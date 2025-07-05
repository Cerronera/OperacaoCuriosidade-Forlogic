const modalAvisos = document.getElementById('modal_avisos');
const modalContainerAvisos = modalAvisos.querySelector('.modal_container');
const avisoHeader = modalAvisos.querySelector('.modal_header');
const avisoBody = modalAvisos.querySelector('.modal_body');
const btnFecharAviso = document.getElementById('btn_fechar_aviso');
const avisoShadow = modalAvisos.querySelector('.modal_shadow');
let avisoCallback = null;

const modalConfirmacao = document.getElementById('modal_confirmacao');
const modalContainerConfirmacao = modalConfirmacao.querySelector('.modal_container');
const confirmacaoHeader = modalConfirmacao.querySelector('.modal_header');
const confirmacaoBody = modalConfirmacao.querySelector('.modal_body');
const confirmacaoShadow = modalConfirmacao.querySelector('.modal_shadow');
const btnConfirmar = document.getElementById('btn_confirmar');
const btnCancelar = document.getElementById('btn_cancelar');

function ativarModal(titulo, descricao, tipo = 'aviso', callback = null) {
    if (!modalAvisos) return;

    avisoCallback = callback;

    // Reset classes
    modalAvisos.classList.remove('tipo-erro', 'tipo-aviso', 'animacao-sair');
    avisoShadow.classList.remove('shadow-animacao-sair');

    // Adiciona classe do tipo
    modalAvisos.classList.add(`tipo-${tipo}`);

    // Configura conteúdo
    let iconeHtml = '';
    switch (tipo) {
        case 'erro':
            iconeHtml = '<i class="fa fa-exclamation-triangle"></i>';
            break;
        case 'aviso':
        default:
            iconeHtml = '<i class="fa fa-info-circle"></i>';
            break;
    }
    avisoHeader.innerHTML = `${iconeHtml} <p>${titulo}</p>`;
    avisoBody.innerHTML = `<p>${descricao}</p>`;

    // Mostra modal
    modalAvisos.classList.add('visivel', 'animacao-entrar');
    avisoShadow.classList.add('visivel', 'shadow-animacao-entrar');
    document.body.classList.add('modal-aviso-aberto');
}

function fecharModalAviso() {
    if (!modalAvisos) return;

    modalAvisos.classList.remove('animacao-entrar');
    avisoShadow.classList.remove('shadow-animacao-entrar');
    modalAvisos.classList.add('animacao-sair');
    avisoShadow.classList.add('shadow-animacao-sair');

    const aoTerminar = () => {
        modalAvisos.classList.remove('visivel', 'animacao-sair');
        avisoShadow.classList.remove('visivel', 'shadow-animacao-sair');
        document.body.classList.remove('modal-aviso-aberto');

        if (typeof avisoCallback === 'function') {
            avisoCallback();
        }
        avisoCallback = null;
        modalAvisos.removeEventListener('animationend', aoTerminar);
    };

    modalAvisos.addEventListener('animationend', aoTerminar, { once: true });
}

if (btnFecharAviso) {
    btnFecharAviso.addEventListener('click', fecharModalAviso);
}
if (avisoShadow) {
    avisoShadow.addEventListener('click', fecharModalAviso);
}

function ativarConfirmacao(titulo, descricao) {
    return new Promise((resolve) => {
        if (!modalConfirmacao) {
            resolve(false);
            return;
        }
        
        confirmacaoHeader.innerHTML = `<i class="fa fa-exclamation-triangle"></i> <p>${titulo}</p>`;
        confirmacaoBody.innerHTML = `<p>${descricao}</p>`;

        // Mostra modal
        modalConfirmacao.classList.remove('animacao-sair');
        confirmacaoShadow.classList.remove('shadow-animacao-sair');
        modalConfirmacao.classList.add('visivel', 'animacao-entrar');
        confirmacaoShadow.classList.add('visivel', 'shadow-animacao-entrar');
        document.body.classList.add('modal-aviso-aberto');

        const fecharFinalizar = (confirmado) => {
            modalConfirmacao.classList.remove('animacao-entrar');
            confirmacaoShadow.classList.remove('shadow-animacao-entrar');
            modalConfirmacao.classList.add('animacao-sair');
            confirmacaoShadow.classList.add('shadow-animacao-sair');

            const aoTerminar = () => {
                modalConfirmacao.classList.remove('visivel', 'animacao-sair');
                confirmacaoShadow.classList.remove('visivel', 'shadow-animacao-sair');
                document.body.classList.remove('modal-aviso-aberto');

                // Remove listeners
                btnConfirmar.onclick = null;
                btnCancelar.onclick = null;
                confirmacaoShadow.onclick = null;

                modalConfirmacao.removeEventListener('animationend', aoTerminar);
                resolve(confirmado);
            };

            modalConfirmacao.addEventListener('animationend', aoTerminar, { once: true });
        };

        // Configura listeners
        btnConfirmar.onclick = () => {
            fecharFinalizar();
            resolve(true)
        }
        btnCancelar.onclick = () => {
            fecharFinalizar()
            resolve(false)
        }
        confirmacaoShadow.onclick = () => {
            fecharFinalizar()
            resolve(false)
        }
    });
}
