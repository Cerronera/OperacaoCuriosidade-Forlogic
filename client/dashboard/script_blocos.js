function contarCadastros(usuarios) {
    return usuarios.length;
}

function contarCadastrosUltimoMes(usuarios) {
    if (!usuarios || usuarios.length === 0) {
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

function contarPendentes(usuarios) {
    if (!usuarios) return 0;
    return usuarios.filter(usuario => !usuario.revisadoUsuario).length;
}


async function atualizarBlocos() {
    const bloco1 = document.getElementById('bloco_1')
    const bloco2 = document.getElementById('bloco_2')
    const bloco3 = document.getElementById('bloco_3')

    if (bloco1) bloco1.textContent = '...';
    if (bloco2) bloco2.textContent = '...';
    if (bloco3) bloco3.textContent = '...';

    try {
        const resposta = await fetch(`${API_BASE_URL}/api/User`, {
            headers: getAuthenticationHeaders()
        });

        if (!resposta.ok) {
            console.error('Falha ao buscar dados para o dashboard');
            if (bloco1) bloco1.textContent = '-';
            if (bloco2) bloco2.textContent = '-';
            if (bloco3) bloco3.textContent = '-';
            return;
        }

        const todosUsuarios = await resposta.json();

        const totalCadastros = contarCadastros(todosUsuarios);
        const totalUltimoMes = contarCadastrosUltimoMes(todosUsuarios);
        const totalPendentes = contarPendentes(todosUsuarios);

        if (bloco1) bloco1.textContent = totalCadastros;
        if (bloco2) bloco2.textContent = totalUltimoMes;
        if (bloco3) bloco3.textContent = totalPendentes;
    } catch (error) {
        console.error('Erro de rede ao atualizar blocos do dashboard:', error);
        if (bloco1) bloco1.textContent = 'Erro';
        if (bloco2) bloco2.textContent = 'Erro';
        if (bloco3) bloco3.textContent = 'Erro';
    }
}