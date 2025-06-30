(function() {
  const usuarioLogado = sessionStorage.getItem('adminLogado')

  if(usuarioLogado){
    ativarModal('Usuário já Logado','Redirecionando para o painel','erro')
    window.location.replace('/dashboard/dashboard.html')
  }
})()

const form = document.getElementById('form_login')

form.addEventListener('submit', async (event) => {

  event.preventDefault(); 
  realizarLogin();
});

function realizarLogin() {
  const emailDigitado = document.getElementById('iemail').value.trim()
  const senhaDigitada = document.getElementById('isenha').value.trim()

  if (emailDigitado === '' || senhaDigitada === '') {
    ativarModal('Campos Não Preenchidos','Preencha todos os campos.', 'erro')
    return
  }

  const admins = JSON.parse(localStorage.getItem('admins')) || []

  const adminEncontrado = admins.find(admin => admin.email === emailDigitado && admin.senha === senhaDigitada)

  if (adminEncontrado && adminEncontrado.senha === senhaDigitada) {
    ativarModal('Login Realizado!', 'Redirecionando para o Dashboard', 'aviso')
    sessionStorage.setItem('adminLogado', JSON.stringify(adminEncontrado))
    sessionStorage.setItem('adminLogado', adminEncontrado.email)
    setTimeout(() => {
      window.location.href = '../dashboard/dashboard.html'
    }, 500);
  } else {
    ativarModal('E-mail ou Senha Incorretos', '', 'erro')
  }
}