// Simula modo mock enquanto o backend não está pronto
const isMock = true;

export const createCard = async (boardId, columnId, cardData) => {
  if (isMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          title: cardData.title,
          dueDate: cardData.dueDate,
          description: cardData.description,
        });
      }, 300);
    });
  }

  // Aqui vai a chamada real quando o backend estiver pronto
  const response = await fetch(`/api/boards/${boardId}/columns/${columnId}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData),
  });

  if (!response.ok) throw new Error("Erro ao criar cartão");
  return await response.json();
};

export const updateCardOrder = async (boardId, columns) => {
  // Simula uma chamada ao backend para salvar a nova ordem
  console.log("Salvando nova ordem dos cartões para o board", boardId);
  console.log("Colunas atualizadas:", columns);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
};
