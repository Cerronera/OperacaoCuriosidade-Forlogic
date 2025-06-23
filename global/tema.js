(function (){
    function aplicarTema(tema){
        if(tema === 'dark'){
            document.documentElement.setAttribute('data-theme','dark')
        } else{
            document.documentElement.removeAttribute('data-theme')
        }
    }

    const temaSalvo = localStorage.getItem('theme')

    if(temaSalvo){
        aplicarTema(temaSalvo)
    }
})();