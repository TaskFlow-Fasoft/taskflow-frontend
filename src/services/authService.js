// src/services/authService.js

const API_URL = 'http://localhost:8080/api'; // ajuste conforme o backend

export const login = async (email, password) => {
  try {
    // Quando o backend estiver pronto, adicione aqui a chamada com fetch ou axios
    console.log(`Tentativa de login com: ${email} / ${password}`);
    
    // Simulando resposta de sucesso
    return {
      success: true,
      token: 'fake-jwt-token',
      user: { email }
    };
  } catch (error) {
    console.error('Erro ao tentar fazer login:', error);
    return {
      success: false,
      message: 'Erro ao tentar fazer login.'
    };
  }
};
