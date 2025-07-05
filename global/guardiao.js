(function () {
    const emailLogado = sessionStorage.getItem('adminLogado');
    if (!emailLogado) {
        window.location.replace('../login_cadastro/login.html');
    } else {
        document.body.classList.add('autenticado');
    }
})();