(function (){
    function aplicarTema(tema){
        if(tema === 'dark'){
            document.body.setAttribute('data-theme','dark')
        } else{
            document.body.removeAttribute('data-theme')
        }
    }

    const temaSalvo = localStorage.getItem('theme')

    if(temaSalvo){
        aplicarTema(temaSalvo)
    }
})();