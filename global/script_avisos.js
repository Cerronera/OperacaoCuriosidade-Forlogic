const modalAvisos = document.getElementById('modal_avisos')
const modalHeader = document.getElementById('modal_header')
const modalBody = document.getElementById('modal_body')
const btnFechar = document.getElementById('btn_fechar')
const modalShadow = document.getElementById('modal_shadow')

function ativarModal(titulo, descricao, tipo) {
    if (!modalAvisos) {
        return;
    }

    modalAvisos.classList.remove('tipo-erro', 'tipo-aviso');
    modalAvisos.classList.add(`tipo-${tipo}`)

    document.body.classList.add('modal-aviso-aberto')

    modalAvisos.style.animation = "entrarModal .5s"
    modalShadow.style.animation = "entrarShadow .5s"
    switch (tipo) {
        case 'erro':
            iconeHtml = '<i class="fa fa-exclamation-triangle"></i>';
            break;

        case 'aviso':
            iconeHtml = '<i class="fa fa-info-circle"></i>';
            break;
    }

    modalHeader.innerHTML = `${iconeHtml} <p>${titulo}</p>`
    modalBody.innerHTML = `<p>${descricao}</p>`

    modalAvisos.style.display = "flex";
    modalShadow.style.display = "block";
}

function fecharModal() {

    if (!modalAvisos) {
        return;
    }

    modalAvisos.style.animation = "sairModal .5s"
    modalShadow.style.animation = "sairShadow .5s"

    setTimeout(() => {
        modalAvisos.style.display = "none"
        modalShadow.style.display = "none"

        document.body.classList.remove('modal-aviso-aberto');
    }, 500);
}

if (btnFechar) {
    btnFechar.addEventListener('click', fecharModal)
}