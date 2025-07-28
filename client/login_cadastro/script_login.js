(function () {
  const token = sessionStorage.getItem('jwtToken')

  if (token) {
    window.location.replace('/client/dashboard/dashboard.html')
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
    return;
  }

  try {
    const resposta = await fetch(`${API_BASE_URL}/api/Login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ EmailDigitado: emailDigitado, SenhaDigitada: senhaDigitada })
    });

    if (!resposta.ok) {
      mostrarSnackbar('E-mail ou Senha Incorretos', 'erro')
      return;
    }

    const token = await resposta.text();

    sessionStorage.setItem('jwtToken', token)

    const respostaWhoAmI = await fetch(`${API_BASE_URL}/api/Admin/WhoAmI`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!respostaWhoAmI.ok) {
      throw new Error('Falha ao buscar dados do administrador')
    }

    const adminInfo = await respostaWhoAmI.json();
    sessionStorage.setItem('adminInfo', JSON.stringify(adminInfo));

    window.location.href = '/client/dashboard/dashboard.html';
    
  } catch (error) {
    console.error("Erro após o login:", error);
  }
}

if (form) {
  form.addEventListener('submit', realizarLogin)
}