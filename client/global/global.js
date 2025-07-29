async function voltar_login() {
    try {
        const confirmado = await ativarConfirmacao("Confirmar Saída", "Você tem certeza que deseja sair?")
        if (confirmado) {
            sessionStorage.clear();
            window.location.href = '/client/login_cadastro/login.html';
        }
    } catch (error) {
        console.log("Logout cancelado pelo usuário")
    }
}

function voltar_home() {
    setTimeout(() => {
        window.location.href = '/client/dashboard/dashboard.html'
    }, 200);
}

function formatarData(dataString) {
    if (!dataString) {
        return ''
    }
    const data = new Date(dataString)

    const dia = String(data.getUTCDate()).padStart(2, '0')
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0')
    const ano = data.getUTCFullYear()

    return `${dia}/${mes}/${ano}`
}

function paginaAtiva(){
    const caminhoAtual = window.location.pathname;
    const linkSidebar = document.querySelectorAll('.sidebar a');
    
    linkSidebar.forEach(link => {
        link.classList.remove('ativo');

        if(link.pathname === caminhoAtual){
            link.classList.add('ativo');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {

    function gerenciarLayoutGlobal() {
        const adminInfoString = sessionStorage.getItem('adminInfo');
        if (!adminInfoString) {
            return;
        }

        const adminInfo = JSON.parse(adminInfoString);
        const isAdministrador = (adminInfo.role === 'Administrator');

        const nomeUsuarioElement = document.querySelector('.usuario_nome');
        if (nomeUsuarioElement && adminInfo.nome) {
            nomeUsuarioElement.textContent = adminInfo.nome;
        }

        const btn_novoAdmin = document.getElementById('btn_novo_administrador');
        if (btn_novoAdmin) {
            btn_novoAdmin.style.display = isAdministrador ? 'flex' : 'none';
        }
    }

    const perfilMenu = document.querySelector('.perfil')
    const trigger = document.getElementById('perfil_trigger')

    if (trigger && perfilMenu) {
        trigger.addEventListener('click', (event) => {
            event.stopPropagation();
            perfilMenu.classList.toggle('ativo')
        });
    }

    window.addEventListener('click', (event) => {
        if (perfilMenu && !perfilMenu.contains(event.target)) {
            perfilMenu.classList.remove('ativo')
        }
    });

    const btnMobile = document.getElementById('btn_mobile')
    const sidebar = document.querySelector('.sidebar')
    const body = document.body

    function toggleMenu(event) {

        if (event.type === 'touchstart') {
            event.preventDefault()
        }

        sidebar.classList.toggle('aberta')
        body.classList.toggle('menu-aberto')

        const menuAberto = sidebar.classList.contains('aberta')
        event.currentTarget.setAttribute('aria-expanded', menuAberto)
    }

    if (btnMobile) {
        btnMobile.addEventListener('click', toggleMenu)
        btnMobile.addEventListener('touchstart', toggleMenu)
    }

    if (sidebar && body) {
        body.addEventListener('click', (event) => {
            if (sidebar.classList.contains('aberta') && !sidebar.contains(event.target) && !btnMobile.contains(event.target)) {
                toggleMenu(event);
            }
        });
    }
    const header = document.querySelector('header.dashboard')
    const btnBusca = document.getElementById('btn_busca')
    const btnFecharBusca = document.getElementById('btn_fechar_busca')

    if (btnBusca) {
        btnBusca.addEventListener('click', () => {

            header.classList.add('busca-ativa')
            campoPesquisa.focus()
        });
    }

    if (btnFecharBusca) {
        btnFecharBusca.addEventListener('click', () => {
            header.classList.remove('busca-ativa')
        });
    }
    gerenciarLayoutGlobal();
    paginaAtiva();
});