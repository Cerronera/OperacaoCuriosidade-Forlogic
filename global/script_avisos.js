const modalAvisos = document.getElementById('modal_avisos');
const modalHeader = document.getElementById('modal_header');
const modalBody = document.getElementById('modal_body');
const btnFechar = document.getElementById('btn_fechar');
const modalShadow = document.getElementById('modal_shadow');

let callbackFechar = null;

function ativarModal(titulo, descricao, tipo = 'aviso', callback = null) {
    if (!modalAvisos) return;

    callbackFechar = callback;

    modalAvisos.classList.remove('animacao-sair', 'animacao-entrar');
    modalShadow.classList.remove('shadow-animacao-sair', 'shadow-animacao-entrar');

    modalAvisos.classList.remove('tipo-erro', 'tipo-aviso', 'tipo-sucesso');
    modalAvisos.classList.add(`tipo-${tipo}`);

    let iconeHtml = '';
    switch (tipo) {
        case 'erro': iconeHtml = '<i class="fa fa-exclamation-triangle"></i>'; break;
        case 'aviso': default: iconeHtml = '<i class="fa fa-info-circle"></i>'; break;
    }
    modalHeader.innerHTML = `${iconeHtml} <p>${titulo}</p>`;
    modalBody.innerHTML = `<p>${descricao}</p>`;

    modalAvisos.classList.add('visivel', 'animacao-entrar');
    modalShadow.classList.add('visivel', 'shadow-animacao-entrar'); 
    document.body.classList.add('modal-aviso-aberto');
}

function fecharModal() {
    if (!modalAvisos) return;

    modalAvisos.classList.add('animacao-sair');
    modalShadow.classList.add('shadow-animacao-sair');

    function aoTerminarAnimacao() {
        modalAvisos.classList.remove('visivel');
        modalShadow.classList.remove('visivel');
        
        modalAvisos.classList.remove('animacao-sair', 'animacao-entrar');
        modalShadow.classList.remove('shadow-animacao-sair', 'shadow-animacao-entrar');
        
        document.body.classList.remove('modal-aviso-aberto');

        if (typeof callbackFechar === 'function') {
            callbackFechar();
        }
        callbackFechar = null;

        modalAvisos.removeEventListener('animationend', aoTerminarAnimacao);
    }
    modalAvisos.addEventListener('animationend', aoTerminarAnimacao);
}

if (btnFechar) {
    btnFechar.addEventListener('click', fecharModal);
}
if (modalShadow) {
    modalShadow.addEventListener('click', fecharModal); 
}