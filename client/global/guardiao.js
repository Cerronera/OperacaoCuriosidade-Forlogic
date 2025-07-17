(function () {
    const emailLogado = sessionStorage.getItem('adminLogado');
    if (!emailLogado) {
        window.location.replace('../client/login_cadastro/login.html');
    } else {
        document.body.classList.add('autenticado');
    }
})();