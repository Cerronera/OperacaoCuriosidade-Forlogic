//função para ver se já tem um usuário logado
//função nao deixa o usuario digitar na url para acessar a página de login
(function() {
  const usuarioLogado = sessionStorage.getItem('adminLogado')

  if(usuarioLogado){
    alert("Você já está logado. Redirecionando para o painel")
    window.location.replace('/dashboard/dashboard.html')
  }
})() //função que se auto inicia

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

  const admins = JSON.parse(localStorage.getItem('admins')) || []

  const adminEncontrado = admins.find(admin => admin.email === emailDigitado && admin.senha === senhaDigitada)

  if (adminEncontrado && adminEncontrado.senha === senhaDigitada) {
    alert('Login realizado!')
    sessionStorage.setItem('adminLogado', JSON.stringify(adminEncontrado))
    sessionStorage.setItem('adminLogado', adminEncontrado.email)
    setTimeout(() => {
      window.location.href = '../dashboard/dashboard.html'
    }, 200);
  } else {
    alert('E-mail ou Senha incorretos')
  }
}