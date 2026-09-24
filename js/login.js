import {
  showMessage, disableButton, enableButton, saveAuthToken, saveUser,
  fetchAPI, redirectTo, MESSAGE_TYPES, validateEmail
} from './utils.js';
import { API_CONFIG, DELAYS } from './config.js';
const loginForm = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!email || !password) {
    showMessage('formMessage', 'Email e senha são obrigatórios', MESSAGE_TYPES.error);
    return;
  }
  if (!validateEmail(email)) {
    showMessage('formMessage', 'Email inválido', MESSAGE_TYPES.error);
    return;
  }
  disableButton('submitBtn', 'Acedendo...');
  showMessage('formMessage', 'Acedendo...', MESSAGE_TYPES.loading);
  try {
    const data = await fetchAPI(API_CONFIG.endpoints.login, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    // Armazenar dados
    saveAuthToken(data.token);
    saveUser(data.user);
    showMessage('formMessage', 'Login realizado com sucesso!', MESSAGE_TYPES.success);
    // Redirecionar após 1.5 segundos
    redirectTo('index.html', DELAYS.redirectAfterSuccess - 1500);
  } catch (error) {
    console.error('Erro:', error);
    showMessage('formMessage', error.message || 'Erro ao fazer login', MESSAGE_TYPES.error);
    enableButton('submitBtn');
  }
});

