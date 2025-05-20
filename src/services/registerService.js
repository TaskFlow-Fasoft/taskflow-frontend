// src/services/registerService.js

import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL; // Ajuste conforme o backend

export const register = async (username, email, password) => {
  try {
    // Faz a requisição POST para o backend para registrar o usuário
    const response = await axios.post(`${VITE_API_URL}/auth/register`, {
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
    console.log(error);
    return {
      success: false,
      message: error.response ? error.response.data.message : 'Erro desconhecido ao tentar registrar.',
    };
  }
};
