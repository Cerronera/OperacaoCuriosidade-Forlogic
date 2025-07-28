(function () {
    const token = sessionStorage.getItem('jwtToken');
    if (!token) {
        sessionStorage.clear();
        window.location.replace('../login_cadastro/login.html');
    } else {
        document.body.classList.add('autenticado');
    }
})();