
function voltar_login() {
    setTimeout(() => {
        window.location.href = '/login_cadastro/login.html'
    }, 200);
}

function voltar_home() {
    setTimeout(() => {
        window.location.href = '/dashboard/dashboard.html'
    }, 200);
}

function ir_relatorios(){

}

function ir_cadastros(){

}

//puxar dados do localstorage para a tabela:
document.addEventListener('DOMContentLoaded',() =>{
    const tabela = document.querySelector('#tabela_usuarios tbody');
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    usuarios.forEach(usuario =>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.telefone}</td>
            <td>${usuario.status}</td>
        `;
        tabela.appendChild(tr);
    });
});



