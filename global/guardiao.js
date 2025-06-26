(function () {
    const emailLogado = sessionStorage.getItem('adminLogado');
    if (!emailLogado) {
        alert("Nenhum administrador logado. Por favor, faça o Login.")
        window.location.replace('../login_cadastro/login.html');
    } else {
        document.body.classList.add('autenticado');
    }
})();