export const register = async (name, email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula atraso da API
  
    // Validações
    if (!name || name.length < 2 || !email.includes("@") || password.length < 6) {
      return {
        success: false,
        message: "Verifique os campos: nome, e-mail e senha válidos.",
      };
    }
  
    // Recupera lista atual de usuários do localStorage
    const storedUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
  
    // Verifica se o e-mail já está cadastrado
    const userExists = storedUsers.find((user) => user.email === email);
    if (userExists) {
      return {
        success: false,
        message: "Este e-mail já está cadastrado.",
      };
    }
  
    // Adiciona novo usuário
    const newUser = { name, email, password };
    storedUsers.push(newUser);
    localStorage.setItem("mockUsers", JSON.stringify(storedUsers));
  
    return {
      success: true,
      message: "Cadastro realizado com sucesso!",
    };
  };
  