async function voltar_login() {
    try {
        await ativarConfirmacao("Confirmar Saída", "Você tem certeza que deseja sair?")
            .then(confirmado => {
                if (confirmado) {
                    sessionStorage.removeItem('jwtToken')
                    sessionStorage.removeItem('adminLogado')
                    window.location.href = '/client/login_cadastro/login.html';
                }
            })
    } catch (error) {
        console.log("Logout cancelado pelo usuário")
    }
}

function voltar_home() {
    setTimeout(() => {
        window.location.href = '/client/dashboard/dashboard.html'
    }, 200);
}

function ir_relatorios() {
    setTimeout(() => {
        window.location.href = '/client/relatorios/relatorios.html'
    }, 200);
}

function ir_cadastros() {
    setTimeout(() => {
        window.location.href = '/client/cadastros/cadastros.html'
    }, 200);
}

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

body.addEventListener('click', (event) => {

    if (sidebar.classList.contains('aberta') && !sidebar.contains(event.target) && !btnMobile.contains(event.target)) {
        toggleMenu(event)
    }
});

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

async function carregarAdmin() {
    const token = sessionStorage.getItem('jwtToken');

    if (!token) {
        window.location.replace('../client/login_cadastro/login.html')
        return;
    }

    try {
        const resposta = await fetch(`${API_BASE_URL}/api/Admin/WhoAmI`, {
            method: 'GET',
            headers: getAuthenticationHeaders()
        });
        if (!resposta.ok) {
            sessionStorage.removeItem('jwtToken')
            sessionStorage.removeItem('adminLogado')
            ativarModal('Sessão Inválida', 'Sua sessão expirou ou é inválida. Por favor, faça login novamente', 'erro', () => {
                window.location.replace('../login_cadastro/login.html')
            });
            return;
        }

        const adminInfo = await resposta.json();

        const nomeUsuarioElement = document.querySelector('.usuario_nome')
        if (nomeUsuarioElement && adminInfo.nome) {
            nomeUsuarioElement.textContent = adminInfo.nome
        }

    } catch (error) {
        console.error('Erro ao carregar informações do admin:', error);
        ativarModal('Erro de Conexão', 'Não foi possível buscar os dados do administrador.', 'erro');
    }
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

document.addEventListener('DOMContentLoaded', () => {

    carregarAdmin()

    function paginaAtiva() {

        const paginaAtual = window.location.pathname
        const linkSidebar = document.querySelectorAll('.sidebar li a')

        linkSidebar.forEach(link => {
            const aoAtivar = link.getAttribute('onclick')

            if (aoAtivar) {
                if (aoAtivar.includes('voltar_home') && paginaAtual.includes('dashboard.html')) {
                    link.classList.add('ativo')
                } else if (aoAtivar.includes('ir_cadastros') && paginaAtual.includes('cadastros.html')) {
                    link.classList.add('ativo')
                } else if (aoAtivar.includes('ir_relatorios') && paginaAtual.includes('relatorios.html')) {
                    link.classList.add('ativo')
                }
            }
        });
    }
    paginaAtiva()

    const perfilMenu = document.querySelector('.perfil')
    const trigger = document.getElementById('perfil_trigger')

    if (trigger) {
        trigger.addEventListener('click', (event) => {
            event.stopPropagation();
            perfilMenu.classList.toggle('ativo')
        });
    }

    window.addEventListener('click', (event) =>{
        if(perfilMenu && !perfilMenu.contains(event.target)){
            perfilMenu.classList.remove('ativo')
        }
    });
});