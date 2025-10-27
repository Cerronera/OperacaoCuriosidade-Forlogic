function padronizarNome(nome) {
    if (!nome) {
        return ''
    }
    const palavras = nome.toLowerCase().split(' ')
    const palavrasNome = palavras.map(palavra => {
        if (['de', 'da', 'do', 'dos', 'e'].includes(palavra)) {
            return palavra
        }
        return palavra.charAt(0).toUpperCase() + palavra.slice(1)
    });
    return palavrasNome.join(' ')
}