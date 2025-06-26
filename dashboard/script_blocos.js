function contarCadastros() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    return usuarios.length;
}

function contarCadastrosUltimoMes() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (usuarios.length === 0) {
        return 0;
    }

    const hoje = new Date();
    const mesAtras = new Date(hoje);
    mesAtras.setMonth(mesAtras.getMonth() - 1)

    return usuarios.filter(usuario => {
        if (!usuario.dataCadastro) {
            return false;
        }

        const dataCadastro = new Date(usuario.dataCadastro)
        return dataCadastro >= mesAtras && dataCadastro <= hoje
    }).length;
}

function contarPendentes() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    return usuarios.filter(usuario => {
        return usuario.revisado === false || typeof usuario.revisado === 'undefined';
    }).length;
}


function atualizarBlocos() {
    const bloco1 = document.getElementById('bloco_1')
    const bloco2 = document.getElementById('bloco_2')
    const bloco3 = document.getElementById('bloco_3')

    if(bloco1){
        bloco1.textContent = contarCadastros();
    }
    if(bloco2){
        bloco2.textContent = contarCadastrosUltimoMes();
    }
    if(bloco3){
        bloco3.textContent = contarPendentes();
    }
}