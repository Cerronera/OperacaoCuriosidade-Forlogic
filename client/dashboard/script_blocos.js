async function atualizarBlocos() {
    const bloco1 = document.querySelector('#bloco_1 h1');
    const bloco2 = document.querySelector('#bloco_2 h1');
    const bloco3 = document.querySelector('#bloco_3 h1');

    if (bloco1) bloco1.textContent = '...';
    if (bloco2) bloco2.textContent = '...';
    if (bloco3) bloco3.textContent = '...';

    try {
        const fetchData = async (endpoint) => {
            const resposta = await fetch(`${API_BASE_URL}${endpoint}`, {
                headers: getAuthenticationHeaders()
            });
            if (!resposta.ok) throw new Error(`Falha na requisição para ${endpoint}`);
            return resposta.json();
        };

        const [totalCadastros, totalUltimoMes, totalPendentes] = await Promise.all([
            fetchData('/api/Dashboard/totalCadastros'),
            fetchData('/api/Dashboard/cadastrosUltimos30Dias'),
            fetchData('/api/Dashboard/pendenciaRevisados')
        ]);

        if (bloco1) bloco1.textContent = totalCadastros;
        if (bloco2) bloco2.textContent = totalUltimoMes;
        if (bloco3) bloco3.textContent = totalPendentes;
        
    } catch (error) {
        console.error('Erro ao atualizar blocos do dashboard:', error);
        if (bloco1) bloco1.textContent = 'Erro';
        if (bloco2) bloco2.textContent = 'Erro';
        if (bloco3) bloco3.textContent = 'Erro';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#bloco_1')) {
        atualizarBlocos();
    }
});
