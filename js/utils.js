import { VALIDATION, MESSAGE_TYPES, DELAYS, STORAGE_KEYS, API_CONFIG } from './config.js';

export function validatePassword(password) {
  if (password.length < VALIDATION.password.minLength) return false;
  if (VALIDATION.password.requireLetters && !/[a-zA-Z]/.test(password)) return false;
  if (VALIDATION.password.requireNumbers && !/[0-9]/.test(password)) return false;
  if (VALIDATION.password.requireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
  return true;
}

export function validateUsername(username) {
  return VALIDATION.username.pattern.test(username);
}

export function validateEmail(email) {
  return VALIDATION.email.pattern.test(email);
}

export function validateFullname(fullname) {
  return fullname.trim().length >= VALIDATION.fullname.minLength;
}

export function validatePasswordsMatch(password, confirmPassword) {
  return password === confirmPassword && password.length > 0;
}

export function showMessage(elementId, message, type = MESSAGE_TYPES.info) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Elemento com ID "${elementId}" não encontrado`);
    return;
  }

  element.textContent = message;
  element.className = `form-message ${type}`;
  element.style.display = 'block';

  // Auto-hide para mensagens de sucesso
  if (type === MESSAGE_TYPES.success || type === MESSAGE_TYPES.warning) {
    setTimeout(() => {
      element.style.display = 'none';
    }, DELAYS.messageAuto);
  }

  return element;
}

export function hideMessage(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
}

export function disableButton(buttonId, text = 'Aguarde...') {
  const button = document.getElementById(buttonId);
  if (button) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = text;
  }
}

export function enableButton(buttonId) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
  }
}

/**
 * STORAGE (localStorage)
 */

export function saveAuthToken(token) {
  try {
    localStorage.setItem(STORAGE_KEYS.authToken, token);
    return true;
  } catch (error) {
    console.error('Erro ao salvar token:', error);
    return false;
  }
}

export function getAuthToken() {
  try {
    return localStorage.getItem(STORAGE_KEYS.authToken);
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
}

export function saveUser(user) {
  try {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    return false;
  }
}

export function getUser() {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.user);
    return true;
  } catch (error) {
    console.error('Erro ao limpar autenticação:', error);
    return false;
  }
}

export function isAuthenticated() {
  return getAuthToken() !== null;
}

/**
 * HTTP REQUESTS
 */

export async function fetchApi(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Erro na requisição');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      const networkError = new Error('Erro de conexão com servidor');
      networkError.isNetworkError = true;
      throw networkError;
    }
    throw error;
  }
}

/**
 * STRING UTILITIES
 */

export function trimInput(value) {
  return value.trim();
}

export function sanitizeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * OTHER UTILITIES
 */

export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

export function redirectTo(url, delay = 0) {
  if (delay > 0) {
    setTimeout(() => {
      window.location.href = url;
    }, delay);
  } else {
    window.location.href = url;
  }
}