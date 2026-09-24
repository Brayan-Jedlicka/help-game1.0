import { fetchAPI, getQueryParam } from './utils.js';
import { API_CONFIG } from './config.js';
const verifyPending = document.getElementById('verifyPending');
const verifySuccess = document.getElementById('verifySuccess');
const verifyError = document.getElementById('verifyError');
const errorMessage = document.getElementById('errorMessage');
async function verifyEmail() {
  try {
    const token = getQueryParam('token');
    const email = getQueryParam('email');
    if (!token && !email) {
      throw new Error('Token de verificação não encontrado.');
    }
    // Se tem token, usar verificação por token
    if (token) {
      await fetchAPI(`${API_CONFIG.endpoints.verifyEmail}?token=${token}`, {
        method: 'GET',
      });
    } else if (email) {
      // Se só tem email, aguardar (geralmente redirecionado do registro)
      showPendingState();
      return;
    }
    // Sucesso
    showSuccessState();
  } catch (error) {
    console.error('Erro:', error);
    showErrorState(error.message);
  }
}
function showPendingState() {
  verifyPending.style.display = 'block';
  verifySuccess.style.display = 'none';
  verifyError.style.display = 'none';
}
function showSuccessState() {
  verifyPending.style.display = 'none';
  verifySuccess.style.display = 'block';
  verifyError.style.display = 'none';
}
function showErrorState(message) {
  verifyPending.style.display = 'none';
  verifySuccess.style.display = 'none';
  verifyError.style.display = 'block';
  if (message) {
    errorMessage.textContent = message;
  }
}
document.addEventListener('DOMContentLoaded', verifyEmail);

