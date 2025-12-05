/**
 * Script de validação e autenticação da página de login
 * Conectado ao banco de dados via API PHP
 */

const API_BASE_URL = 'api';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const teamInput = document.getElementById('team');
  const loginButton = document.querySelector('.login-button');
  const loader = document.getElementById('loader');

  // Mensagens de erro
  const usernameError = document.getElementById('usernameError');
  const emailError = document.getElementById('emailError');
  const teamError = document.getElementById('teamError');

  // Validação em tempo real
  usernameInput.addEventListener('input', () => {
    validateUsername();
  });

  emailInput.addEventListener('input', () => {
    validateEmail();
  });

  teamInput.addEventListener('change', () => {
    validateTeam();
  });

  // Validação do nome de usuário
  function validateUsername() {
    const username = usernameInput.value.trim();
    
    if (username.length === 0) {
      usernameError.textContent = '';
      return false;
    }

    if (username.length < 3) {
      usernameError.textContent = 'Nome deve ter pelo menos 3 caracteres';
      return false;
    }

    if (username.length > 50) {
      usernameError.textContent = 'Nome deve ter no máximo 50 caracteres';
      return false;
    }

    if (!/^[a-zA-Z0-9_áàâãéèêíìîóòôõúùûçÁÀÂÃÉÈÊÍÌÎÓÒÔÕÚÙÛÇ\s]+$/.test(username)) {
      usernameError.textContent = 'Use apenas letras, números e espaços';
      return false;
    }

    usernameError.textContent = '';
    return true;
  }

  // Validação do e-mail
  function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length === 0) {
      emailError.textContent = '';
      return false;
    }

    if (!emailRegex.test(email)) {
      emailError.textContent = 'Digite um e-mail válido';
      return false;
    }

    emailError.textContent = '';
    return true;
  }

  // Validação do time
  function validateTeam() {
    const team = teamInput.value;

    if (!team) {
      teamError.textContent = 'Selecione um time';
      return false;
    }

    teamError.textContent = '';
    return true;
  }

  // Função para mostrar erros do servidor
  function showServerErrors(errors) {
    if (errors.nome) {
      usernameError.textContent = errors.nome;
    }
    if (errors.email) {
      emailError.textContent = errors.email;
    }
    if (errors.time) {
      teamError.textContent = errors.time;
    }
  }

  // Função para limpar erros
  function clearErrors() {
    usernameError.textContent = '';
    emailError.textContent = '';
    teamError.textContent = '';
  }

  // Submissão do formulário
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar todos os campos
    const isUsernameValid = validateUsername();
    const isEmailValid = validateEmail();
    const isTeamValid = validateTeam();

    if (!isUsernameValid || !isEmailValid || !isTeamValid) {
      // Mostrar mensagem de erro geral se necessário
      if (!isUsernameValid) {
        usernameInput.focus();
      } else if (!isEmailValid) {
        emailInput.focus();
      } else if (!isTeamValid) {
        teamInput.focus();
      }
      return;
    }

    // Obter dados do formulário
    const formData = {
      nome: usernameInput.value.trim(),
      email: emailInput.value.trim(),
      time: teamInput.value
    };

    // Mostrar loading
    loginButton.classList.add('loading');
    loginButton.disabled = true;
    clearErrors();

    try {
      // Fazer requisição ao backend
      const response = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        // Login bem-sucedido
        // Salvar dados do banco (nome e email) e time do formulário no localStorage
        const userDataToSave = {
          ...result.data.usuario, // id, nome, email do banco
          time: formData.time // time do formulário (não salvo no banco)
        };
        localStorage.setItem('userData', JSON.stringify(userDataToSave));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', result.data.usuario.id);

        // Mostrar mensagem de sucesso brevemente
        loginButton.textContent = '✓ Sucesso!';
        await new Promise(resolve => setTimeout(resolve, 500));

        // Redirecionar para o jogo
        window.location.href = 'game.html';
      } else {
        // Erro no login
        loginButton.classList.remove('loading');
        loginButton.disabled = false;

        if (result.data && result.data.errors) {
          showServerErrors(result.data.errors);
        } else {
          // Mostrar mensagem de erro geral
          const errorMsg = result.message || 'Erro ao fazer login. Tente novamente.';
          alert(errorMsg);
        }
      }
    } catch (error) {
      // Erro de rede ou conexão
      console.error('Erro ao fazer login:', error);
      loginButton.classList.remove('loading');
      loginButton.disabled = false;
      
      // Tentar usar localStorage como fallback (modo offline)
      console.warn('Usando modo offline (localStorage)');
      const offlineUserData = {
        id: Date.now(),
        nome: formData.nome,
        email: formData.email,
        time: formData.time // time salvo apenas localmente
      };
      localStorage.setItem('userData', JSON.stringify(offlineUserData));
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = 'game.html';
    }
  });

  // Verificar se já está logado
  if (localStorage.getItem('isLoggedIn') === 'true') {
    // Opcional: redirecionar automaticamente se já estiver logado
    // window.location.href = 'game.html';
  }

  // Preencher campos se houver dados salvos (opcional)
  const savedData = localStorage.getItem('userData');
  if (savedData) {
    try {
      const userData = JSON.parse(savedData);
      usernameInput.value = userData.nome || userData.username || '';
      emailInput.value = userData.email || '';
      teamInput.value = userData.time || '';
    } catch (e) {
      console.error('Erro ao carregar dados salvos:', e);
    }
  }
});
