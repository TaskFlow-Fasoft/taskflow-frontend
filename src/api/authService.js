// src/api/authService.js

import axios from 'axios';
import { VITE_API_URL } from "../config/config";

// Função para verificar se o token está expirado
export const isTokenExpired = () => {
  const expiresAt = localStorage.getItem('expires_at');
  if (!expiresAt) return true;

  const expirationTime = new Date(expiresAt).getTime();
  const currentTime = new Date().getTime();

  return currentTime >= expirationTime;
};

// Função para limpar os dados de autenticação
export const clearAuthData = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('expires_at');
  localStorage.removeItem('username');
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return token && !isTokenExpired();
};

export const login = async (email, password) => {
  try {
    // Realiza a requisição ao backend utilizando Axios
    const response = await axios.post(`${VITE_API_URL}/auth/login`, { email, password });

    // Verifica se a resposta foi bem-sucedida
    if (response.status === 200) {
      // Calcula a data de expiração (24 horas a partir de agora)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // Retorna a resposta com os dados do token e usuário
      return {
        success: true,
        access_token: response.data.access_token,
        expires_at: expiresAt.toISOString(),
        username: response.data.username
      };
    } else {
      // Em caso de resposta diferente de 200, retorna falha
      return {
        success: false,
        message: response.data.detail
      };
    }
  } catch (error) {
    // Captura qualquer erro da requisição
    console.error('Erro ao tentar fazer login:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Email ou senha incorretos.'
    };
  }
};

// Interceptor para verificar token expirado
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Não redireciona se for uma requisição de login
    if (error.config.url.includes('/auth/login')) {
      return Promise.reject(error);
    }

    // Redireciona apenas se não for login e o token estiver expirado
    if (error.response?.status === 401 || isTokenExpired()) {
      clearAuthData();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
