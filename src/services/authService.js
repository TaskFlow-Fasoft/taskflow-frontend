// src/services/authService.js

import axios from 'axios';

const API_URL = 'http://25.59.132.184:8000'; // ajuste conforme o backend

export const login = async (email, password) => {
  try {
    // Realiza a requisição ao backend utilizando Axios
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });

    // Verifica se a resposta foi bem-sucedida
    if (response.status === 200) {
      // Retorna a resposta com os dados do token e usuário
      return {
        success: true,
        access_token: response.data.access_token,
        expires_at: response.data.expires_at
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
      message: error.response ? error.response.data.message : 'Erro ao tentar fazer login.'
    };
  }
};
