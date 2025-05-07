// src/services/registerService.js

import axios from 'axios';

const API_URL = 'http://25.59.132.184:8000'; // Ajuste conforme o backend

export const register = async (username, email, password) => {
  try {
    // Faz a requisição POST para o backend para registrar o usuário
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      password
    });

    if (response.status === 200) {
      return {
        success: true,
        message: 'Cadastro realizado com sucesso!',
      };
    } else {
      return {
        success: false,
        message: response.data.detail || 'Erro no cadastro.',
      };
    }
  } catch (error) {
    console.error('Erro ao tentar registrar:', error);
    return {
      success: false,
      message: error.response ? error.response.data.message : 'Erro desconhecido ao tentar registrar.',
    };
  }
};
