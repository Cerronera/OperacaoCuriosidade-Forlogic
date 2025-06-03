const form = document.getElementById('form_login')

form.addEventListener('submit', async (event) => {

  event.preventDefault(); //impede o formulario de recarregar a página
  realizarLogin();
});

function realizarLogin() {
  const emailDigitado = document.getElementById('iemail').value.trim()
  const senhaDigitada = document.getElementById('isenha').value.trim()

  if (emailDigitado === '' || senhaDigitada === '') {
    alert('Preencha todos os campos.')
    return
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []

  const usuarioEncontrado = usuarios.find(user => user.email === emailDigitado && user.senha === senhaDigitada)

  if (usuarioEncontrado) {
    alert('Login realizado!')
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado))

    setTimeout(() => {
      window.location.href = '../dashboard/dashboard.html'
    }, 1000);
  } else {
    alert('E-mail ou Senha incorretos')
  }
}