(function() {
  const token = sessionStorage.getItem('jwtToken')

  if(token){
    window.location.replace('/dashboard/dashboard.html')
  }
})();

const form = document.getElementById('form_login')

 async function realizarLogin(event) {
  event.preventDefault();

  const email = document.getElementById('iemail')
  const senha = document.getElementById('isenha')
  const emailDigitado = email.value.trim()
  const senhaDigitada = senha.value.trim()

  if (emailDigitado === '' || senhaDigitada === '') {
    ativarModal('Atenção', 'Preencha todos os campos', 'aviso')
    return;
  }

  try{
    const resposta = await fetch (`${API_BASE_URL}/api/Login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ EmailDigitado: emailDigitado, SenhaDigitada: senhaDigitada})
    });

    if(!resposta.ok){
      ativarModal('Erro', 'E-mail ou Senha Incorretos', 'erro')
      return;
    }

    const token = await resposta.text();

    sessionStorage.setItem('jwtToken',token)
    sessionStorage.setItem('adminLogado', emailDigitado)
    window.location.href = '../dashboard/dashboard.html'

  } catch(error){
     ativarModal('Erro de Conexão', 'Erro de conexão com o servidor.', 'erro');
    console.error('Erro ao logar:', error);
  }
}
if(form){
  form.addEventListener('submit', realizarLogin)
}